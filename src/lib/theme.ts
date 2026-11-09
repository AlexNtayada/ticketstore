import type { CSSProperties } from "react";
import type { EventConfig, ThemeTokens } from "@/types/event";
import { displayFontMetrics, themes } from "@/config/themes";

/** "cards": light, rounded, card-based sections. "poster" (default): typographic poster grid. */
export function getThemeLayout(event: EventConfig) {
  return themes[event.theme]?.layout ?? "poster";
}

/** Resolves theme tokens (preset + optional premium overrides) into CSS custom properties. */
export function getThemeTokens(event: EventConfig): ThemeTokens {
  const preset = themes[event.theme] ?? themes.midnight;
  const overrides = event.features.customColors ? event.customColors ?? {} : {};
  return { ...preset, ...overrides };
}

export function getThemeStyle(event: EventConfig): CSSProperties {
  const t = getThemeTokens(event);
  const metrics = displayFontMetrics[event.displayFont] ?? displayFontMetrics.anton;
  const custom = event.features.customFonts && event.customFont;
  return {
    "--color-background": t.background,
    "--color-surface": t.surface,
    "--color-surface-elevated": t.surfaceElevated,
    "--color-text-primary": t.textPrimary,
    "--color-text-secondary": t.textSecondary,
    "--color-accent": t.accent,
    "--color-accent-foreground": t.accentForeground,
    "--color-border": t.border,
    "--color-inverse-bg": t.inverseBackground,
    "--color-inverse-text": t.inverseText,
    "--display-char-width": String(custom && event.customFont?.charWidth ? event.customFont.charWidth : metrics.charWidth),
    "--display-line-height": String(metrics.lineHeight),
    ...(custom ? { "--font-display": `"${event.customFont!.family}", var(--font-display-src), Impact, sans-serif` } : {}),
  } as CSSProperties;
}
