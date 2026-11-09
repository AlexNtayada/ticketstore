// Builds a static export and rewrites absolute asset paths to relative ones,
// so the site works from any sub-folder (preview hosting, a CDN bucket, etc.).
// Usage: node scripts/export-relative.mjs  → output in ./out-relative
import { execSync } from "node:child_process";
import { cpSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync, renameSync } from "node:fs";
import { join, extname } from "node:path";

const root = new URL("..", import.meta.url).pathname;
execSync("npx next build", { cwd: root, stdio: "inherit", env: { ...process.env, STATIC_EXPORT: "1" } });

const out = join(root, "out-relative");
rmSync(out, { recursive: true, force: true });
cpSync(join(root, "out"), out, { recursive: true });

const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));
for (const file of walk(out)) {
  const ext = extname(file);
  if (![".html", ".js", ".css", ".txt"].includes(ext)) continue;
  let s = readFileSync(file, "utf8");
  if (ext === ".css") {
    s = s.replaceAll("/_next/static/media/", "../media/");
  } else {
    s = s.replace(/(["'(\s,=])\/_next\//g, "$1./assets/");
    s = s.replace(/(["'(\s,=]|\\")\/(images|icons)\//g, "$1./$2/");
  }
  // Escape literal U+FFFD (some hosts reject it in uploaded text files); only occurs inside JS strings.
  if (ext === ".js") s = s.replaceAll("\ufffd", "\\ufffd");
  writeFileSync(file, s);
}
// Some static hosts reserve names starting with "_": serve Next's assets from /assets instead.
renameSync(join(out, "_next"), join(out, "assets"));
for (const f of ["404.html", "index.txt", "robots.txt", "sitemap.xml"]) rmSync(join(out, f), { force: true });
// Keep the app at site.html; index.html becomes a light entry point when PREVIEW_ENTRY=1.
if (process.env.PREVIEW_ENTRY === "1") renameSync(join(out, "index.html"), join(out, "site.html"));
console.log("Relative export ready:", out);
