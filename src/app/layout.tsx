import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { event } from "@/config/event";
import { displayFonts, interfaceFont } from "@/lib/fonts";
import { buildMetadata } from "@/lib/seo";
import { getThemeStyle, getThemeTokens } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = buildMetadata(event);

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: getThemeTokens(event).background,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const display = displayFonts[event.displayFont] ?? displayFonts.anton;
  const customFont = event.features.customFonts ? event.customFont : undefined;
  return (
    <html
      lang={event.locale}
      className={`${display.variable} ${interfaceFont.variable}`}
      style={getThemeStyle(event)}
      data-skin={event.theme}
    >
      <head>
        {customFont ? (
          <>
            <link rel="preload" href={customFont.src} as="font" type={`font/${customFont.format}`} crossOrigin="anonymous" />
            <style>{`@font-face{font-family:"${customFont.family.replace(/"/g, "")}";src:url("${customFont.src}") format("${customFont.format}");font-display:swap;}`}</style>
          </>
        ) : null}
      </head>
      <body>{children}</body>
    </html>
  );
}
