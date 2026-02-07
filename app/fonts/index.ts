import localFont from "next/font/local"

export const love = localFont({
  src: "./Love.otf",
  display: "swap",
})

export const sangbleu = localFont({
  src: [
    { path: "./sangbleusunrise-light.otf", weight: "300", style: "normal" },
    { path: "./sangbleusunrise-regular.otf", weight: "400", style: "normal" },
    { path: "./sangbleusunrise-medium.otf", weight: "500", style: "normal" },
    { path: "./sangbleusunrise-bold.otf", weight: "700", style: "normal" },
  ],
  display: "swap",
})
