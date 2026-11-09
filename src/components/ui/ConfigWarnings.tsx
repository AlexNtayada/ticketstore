"use client";

import { useState } from "react";
import type { ConfigIssue } from "@/lib/ticketstore";

/** Development-only panel listing configuration problems. Never rendered in production builds. */
export function ConfigWarnings({ issues }: { issues: ConfigIssue[] }) {
  const [open, setOpen] = useState(false);
  if (!issues.length) return null;
  const errors = issues.filter((i) => i.level === "error").length;
  return (
    <div className="fixed left-3 top-[calc(var(--header-h)+8px)] z-[70] max-w-[min(420px,calc(100vw-24px))] font-sans text-xs">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="rounded-full bg-[#ff3b30] px-3 py-1.5 font-semibold text-white shadow-lg"
      >
        Config: {errors} error{errors === 1 ? "" : "s"}, {issues.length - errors} warning{issues.length - errors === 1 ? "" : "s"}
      </button>
      {open ? (
        <ul className="mt-2 max-h-[60vh] space-y-2 overflow-auto rounded-lg bg-white p-3 text-[#111] shadow-xl">
          {issues.map((i, n) => (
            <li key={n}>
              <code className={i.level === "error" ? "text-[#c00]" : "text-[#a60]"}>{i.field}</code> — {i.message}
            </li>
          ))}
          <li className="border-t pt-2 text-[#666]">Edit src/config/event.ts. This panel is hidden in production.</li>
        </ul>
      ) : null}
    </div>
  );
}
