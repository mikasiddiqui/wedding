"use client"

import { useEffect, useRef } from "react"
import type { ElementType, ReactNode } from "react"

// One-shot flag for CSS reveals. Set on the DOM directly, so scrolling never re-renders.
export function useInViewFlag<T extends HTMLElement>(rootMargin = "0px 0px -12% 0px") {
  const ref = useRef<T>(null)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (!("IntersectionObserver" in window)) {
      element.dataset.inview = "true"
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.dataset.inview = "true"
          observer.disconnect()
        }
      },
      { rootMargin }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [rootMargin])
  return ref
}

export default function InView({
  as: Tag = "div",
  className,
  children,
}: {
  as?: ElementType
  className?: string
  children: ReactNode
}) {
  const ref = useInViewFlag<HTMLElement>()
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
