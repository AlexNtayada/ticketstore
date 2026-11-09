import { Anton, Archivo_Black, Barlow_Condensed, Bebas_Neue, Bodoni_Moda, DM_Sans, Poppins, Space_Grotesk } from "next/font/google";
import type { DisplayFontName } from "@/types/event";

/**
 * Display faces. Only the configured one is applied to the page; the others
 * are declared with preload: false, so browsers never download them.
 */
const anton = Anton({ weight: "400", subsets: ["latin", "latin-ext"], display: "swap", variable: "--font-display-src" });
const bebas = Bebas_Neue({ weight: "400", subsets: ["latin", "latin-ext"], display: "swap", preload: false, variable: "--font-display-src" });
const archivoBlack = Archivo_Black({ weight: "400", subsets: ["latin", "latin-ext"], display: "swap", preload: false, variable: "--font-display-src" });
const barlowCondensed = Barlow_Condensed({ weight: ["600", "800"], subsets: ["latin", "latin-ext"], display: "swap", preload: false, variable: "--font-display-src" });
const spaceGrotesk = Space_Grotesk({ weight: ["500", "700"], subsets: ["latin", "latin-ext"], display: "swap", preload: false, variable: "--font-display-src" });

const bodoni = Bodoni_Moda({ subsets: ["latin", "latin-ext"], display: "swap", preload: false, variable: "--font-display-src" });

const poppins = Poppins({ weight: ["600", "700"], subsets: ["latin", "latin-ext"], display: "swap", preload: false, variable: "--font-display-src" });

export const interfaceFont = DM_Sans({ subsets: ["latin", "latin-ext"], display: "swap", variable: "--font-ui-src", axes: ["opsz"] });

export const displayFonts: Record<DisplayFontName, { variable: string }> = {
  anton,
  bebas,
  "archivo-black": archivoBlack,
  "barlow-condensed": barlowCondensed,
  "space-grotesk": spaceGrotesk,
  bodoni,
  poppins,
};
