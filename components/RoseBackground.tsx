"use client"

export default function RoseBackground() {
  return (
    <video
      src="/video/rose.webm"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      ref={(el) => {
        if (el) el.playbackRate = 0.8
      }}
      className="
        fixed inset-0 -z-10
        h-full w-full object-cover
        opacity-[0.35]
        saturate-[0.9]
        blur-[1px]
        mix-blend-soft-light
        pointer-events-none
      "
    />
  )
}
