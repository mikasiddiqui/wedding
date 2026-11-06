import localFont from "next/font/local"

export const love = localFont({
  src: "./Love.woff2",
  display: "swap",
})

// Not used by the hero, so it isn't preloaded. Only the weights in use get downloaded.
export const sangbleu = localFont({
  src: [
    { path: "./sangbleusunrise-light.woff2", weight: "300", style: "normal" },
    { path: "./sangbleusunrise-regular.woff2", weight: "400", style: "normal" },
    { path: "./sangbleusunrise-medium.woff2", weight: "500", style: "normal" },
    { path: "./sangbleusunrise-bold.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  preload: false,
})
