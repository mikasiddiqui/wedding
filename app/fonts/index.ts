import localFont from "next/font/local"

export const love = localFont({
  src: "./Love.woff2",
  display: "swap",
  variable: "--font-love-face",
})

// Not used by the hero, so it isn't preloaded. Only the weights in use get downloaded.
// These are SangBleu's trial files: they have no numerals (bar 0) and no : & ' or en dash.
// The unicode range skips those characters, so they come from fallbacks rather than a mix:
// & from the script (see "Wedding Amp" in globals.css), the rest from one system face.
// When the licensed files replace these, delete `declarations` and `fallback`.
export const sangbleu = localFont({
  src: [
    { path: "./sangbleusunrise-light.woff2", weight: "300", style: "normal" },
    { path: "./sangbleusunrise-lightitalic.woff2", weight: "300", style: "italic" },
    { path: "./sangbleusunrise-regular.woff2", weight: "400", style: "normal" },
    { path: "./sangbleusunrise-medium.woff2", weight: "500", style: "normal" },
    { path: "./sangbleusunrise-bold.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  preload: false,
  variable: "--font-sangbleu-face",
  declarations: [{ prop: "unicode-range", value: "U+0-25, U+28-2F, U+3B-2012, U+2014-10FFFF" }],
  fallback: ["Wedding Amp", "Avenir Next", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
  adjustFontFallback: false,
})

// Open-licensed script for the ampersand and accent words (SIL OFL, see private/licences).
export const script = localFont({
  src: "./PinyonScript.woff2",
  display: "swap",
  variable: "--font-script-face",
})
