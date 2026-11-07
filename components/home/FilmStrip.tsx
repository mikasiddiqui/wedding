"use client"

import { useEffect, useRef } from "react"

const DRIFT = 14 // px per second, the speed the strip wanders at when left alone
const landscape = new Set([3, 6])
const photos = Array.from({ length: 11 }, (_, i) => i + 1)

function Frame({ n, duplicate }: { n: number; duplicate?: boolean }) {
  const wide = landscape.has(n)
  const [small, large] = wide ? [960, 1440] : [640, 960]
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/images/gallery/${n}-${small}.webp`}
      srcSet={`/images/gallery/${n}-${small}.webp ${small}w, /images/gallery/${n}-${large}.webp ${large}w`}
      sizes="(min-width: 768px) 380px, 260px"
      width={wide ? 1440 : 960}
      height={wide ? 960 : 1440}
      alt={duplicate ? "" : `Gallery photo ${n}`}
      draggable={false}
      loading="lazy"
      decoding="async"
      className={`film-frame ${n % 2 ? "film-frame-low" : ""}`}
    />
  )
}

/**
 * A strip of photographs that drifts on its own and can be dragged either way. The loop
 * only runs while the strip is on screen, and only ever writes one transform.
 */
export default function FilmStrip() {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const track = trackRef.current
    if (!root || !track) return

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let x = 0
    let velocity = 0
    let dragging = false
    let lastX = 0
    let lastTime = 0
    let frame = 0
    let previous = 0

    const tick = (time: number) => {
      const dt = Math.min(0.05, (time - previous) / 1000 || 0)
      previous = time
      if (!dragging) {
        x += (velocity + (still ? 0 : -DRIFT)) * dt
        velocity *= Math.pow(0.04, dt)
      }
      const half = track.scrollWidth / 2
      if (half > 0) {
        if (x <= -half) x += half
        if (x > 0) x -= half
      }
      track.style.transform = `translate3d(${x}px,0,0)`
      frame = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame)
      if (entry.isIntersecting) {
        previous = performance.now()
        frame = requestAnimationFrame(tick)
      }
    })
    observer.observe(root)

    const onDown = (event: PointerEvent) => {
      dragging = true
      velocity = 0
      lastX = event.clientX
      lastTime = event.timeStamp
      root.setPointerCapture(event.pointerId)
    }
    const onMove = (event: PointerEvent) => {
      if (!dragging) return
      const dx = event.clientX - lastX
      const dt = Math.max(1, event.timeStamp - lastTime)
      x += dx
      velocity = (dx / dt) * 1000
      lastX = event.clientX
      lastTime = event.timeStamp
    }
    const onUp = () => {
      dragging = false
    }

    root.addEventListener("pointerdown", onDown)
    root.addEventListener("pointermove", onMove)
    root.addEventListener("pointerup", onUp)
    root.addEventListener("pointercancel", onUp)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      root.removeEventListener("pointerdown", onDown)
      root.removeEventListener("pointermove", onMove)
      root.removeEventListener("pointerup", onUp)
      root.removeEventListener("pointercancel", onUp)
    }
  }, [])

  return (
    <div ref={rootRef} className="film" aria-label="Photo gallery. Drag to explore." role="group">
      <div ref={trackRef} className="film-track">
        {photos.map((n) => (
          <Frame key={n} n={n} />
        ))}
        <div aria-hidden="true" className="contents">
          {photos.map((n) => (
            <Frame key={n} n={n} duplicate />
          ))}
        </div>
      </div>
    </div>
  )
}
