import type { DisplayFontName, ThemeName, ThemeTokens } from "@/types/event";

/**
 * Colour presets. Each is a pair: a ground colour and one accent.
 * The accent is reserved for ticket CTAs, small marks, selected states and
 * key metadata; components never apply it decoratively.
 */
export type ThemeLayout = "poster" | "cards";

export const themes: Record<ThemeName, ThemeTokens & { label: string; layout?: ThemeLayout }> = {
  midnight: {
    label: "Midnight / Acid Lime",
    background: "#101010",
    surface: "#1C1C1C",
    surfaceElevated: "#252525",
    textPrimary: "#F5F3EF",
    textSecondary: "#A7A7A3",
    accent: "#DFFF5B",
    accentForeground: "#101010",
    border: "rgba(255, 255, 255, 0.16)",
    inverseBackground: "#F5F3EF",
    inverseText: "#101010",
  },
  ember: {
    label: "Black / Electric Orange",
    background: "#0B0B0B",
    surface: "#181715",
    surfaceElevated: "#22201D",
    textPrimary: "#F4F1EA",
    textSecondary: "#A39F97",
    accent: "#FF5A1F",
    accentForeground: "#0B0B0B",
    border: "rgba(255, 255, 255, 0.15)",
    inverseBackground: "#FF5A1F",
    inverseText: "#0B0B0B",
  },
  paper: {
    label: "Off White / Cobalt Blue",
    background: "#F1EEE7",
    surface: "#E6E2D8",
    surfaceElevated: "#DCD7CB",
    textPrimary: "#111111",
    textSecondary: "#58564F",
    accent: "#1F3BFF",
    accentForeground: "#FFFFFF",
    border: "rgba(17, 17, 17, 0.18)",
    inverseBackground: "#111111",
    inverseText: "#F1EEE7",
  },
  burgundy: {
    label: "Dark Burgundy / Cream",
    background: "#2A0B12",
    surface: "#36131B",
    surfaceElevated: "#431A23",
    textPrimary: "#F3E8D2",
    textSecondary: "#C9B79F",
    accent: "#F3E8D2",
    accentForeground: "#2A0B12",
    border: "rgba(243, 232, 210, 0.2)",
    inverseBackground: "#F3E8D2",
    inverseText: "#2A0B12",
  },
  neon: {
    label: "Black / Hot Pink",
    background: "#0A0A0A",
    surface: "#171417",
    surfaceElevated: "#211C21",
    textPrimary: "#F7F2F5",
    textSecondary: "#A99FA6",
    accent: "#FF2E88",
    accentForeground: "#0A0A0A",
    border: "rgba(255, 255, 255, 0.15)",
    inverseBackground: "#FF2E88",
    inverseText: "#0A0A0A",
  },
  organizer: {
    label: "Warm White / Signal Orange (organizer marketing style)",
    background: "#F4F1EA",
    surface: "#FFFFFF",
    surfaceElevated: "#EAE5DA",
    textPrimary: "#1E1A17",
    textSecondary: "#5C5650",
    accent: "#C23E0B",
    accentForeground: "#FFFFFF",
    border: "rgba(30, 26, 23, 0.14)",
    inverseBackground: "#1E1A17",
    inverseText: "#F4F1EA",
  },
  sky: {
    label: "White / Orange accent (light, card-based)",
    layout: "cards",
    background: "#FFFFFF",
    surface: "#F5F7FA",
    surfaceElevated: "#EAEFF6",
    textPrimary: "#101828",
    textSecondary: "#667085",
    accent: "#EA6C28",
    accentForeground: "#FFFFFF",
    border: "rgba(16, 24, 40, 0.1)",
    inverseBackground: "#0B1220",
    inverseText: "#FFFFFF",
  },
};

/**
 * Average uppercase glyph width (in em) for each display face.
 * Used to size the artist name so it fills the hero without being cropped.
 */
export const displayFontMetrics: Record<DisplayFontName, { charWidth: number; lineHeight: number }> = {
  anton: { charWidth: 0.46, lineHeight: 0.86 },
  bebas: { charWidth: 0.43, lineHeight: 0.86 },
  "archivo-black": { charWidth: 0.78, lineHeight: 1.08 },
  "barlow-condensed": { charWidth: 0.5, lineHeight: 0.88 },
  "space-grotesk": { charWidth: 0.68, lineHeight: 0.92 },
  bodoni: { charWidth: 0.72, lineHeight: 1.14 },
  poppins: { charWidth: 0.62, lineHeight: 1.1 },
};
