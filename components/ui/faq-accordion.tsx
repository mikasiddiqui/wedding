"use client"

import { useId, useState } from "react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/*
 * Adapted from Vengeance UI's FAQ Accordion (MIT, Ashutoshx7/VengeanceUI).
 * Keeps its state and grid-row height animation. Restyled as ruled rows on the page,
 * with proper ARIA wiring, and without the demo copy and heavy side borders.
 */
export type FaqItem = { question: string; answer: ReactNode }

export default function FaqAccordion({ items, className }: { items: FaqItem[]; className?: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const baseId = useId()

  return (
    <ul className={cn("w-full list-none border-t border-[var(--line)] p-0", className)}>
      {items.map((item, index) => {
        const isActive = activeIndex === index
        const panelId = `${baseId}-${index}`
        return (
          <li key={item.question} className="border-b border-[var(--line)]">
            <button
              type="button"
              aria-expanded={isActive}
              aria-controls={panelId}
              onClick={() => setActiveIndex(isActive ? null : index)}
              className="flex min-h-16 w-full cursor-pointer items-center justify-between gap-6 py-6 text-left text-[clamp(1.35rem,2.3vw,1.9rem)] font-light leading-tight tracking-[-0.015em] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
            >
              <span>{item.question}</span>
              <span
                aria-hidden="true"
                className={cn(
                  "relative size-4 shrink-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
                  "before:absolute before:left-0 before:top-1/2 before:h-px before:w-full before:bg-current",
                  "after:absolute after:left-1/2 after:top-0 after:h-full after:w-px after:bg-current",
                  isActive && "rotate-[135deg]"
                )}
              />
            </button>
            <div
              id={panelId}
              className={cn(
                "grid transition-[grid-template-rows] duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
                isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden" inert={!isActive}>
                <div className="max-w-[60ch] pb-7 pr-8 text-[1.08rem] leading-[1.65] text-[var(--ink-soft)]">
                  {item.answer}
                </div>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
