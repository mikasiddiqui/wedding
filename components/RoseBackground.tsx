"use client"

import { useEffect, useRef } from "react"

/*
 * The soft-light blend, saturation, blur and 0.8x speed are baked into the video
 * file, so the browser only has to draw one opaque layer. Don't add CSS filters or
 * blend modes back here: recompositing them every frame across the whole viewport
 * is what made scrolling lag. The poster is the video's first frame.
 */
export default function RoseBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (prefersReducedMotion || connection?.saveData) return

    const start = () => {
      video.muted = true
      // Autoplay can be refused (e.g. iOS Low Power Mode); the poster stays up.
      video.play().catch(() => {})
    }

    // Let the first paint and hydration finish before fetching the video.
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 1500 })
      return () => window.cancelIdleCallback(id)
    }
    const id = setTimeout(start, 400)
    return () => clearTimeout(id)
  }, [])

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload="none"
      poster="/video/rose-poster.webp"
      aria-hidden="true"
      tabIndex={-1}
      className="fixed inset-0 -z-10 h-full w-full object-cover pointer-events-none"
    >
      <source src="/video/rose.webm" type='video/webm; codecs="vp9"' />
      <source src="/video/rose.mp4" type="video/mp4" />
    </video>
  )
}
