"use client"

import type { ElementType } from "react"
import { useInViewFlag } from "./InView"

/*
 * Text that slowly resolves out of a soft blur, a word (or letter) at a time. Based on Vengeance UI's
 * Stagger Text (MIT, Ashutoshx7/VengeanceUI), rewritten as a CSS animation so it needs
 * no motion library and costs nothing once it has played. `.r-unit` is in globals.css.
 */
export type RevealPart = { text: string; accent?: boolean }

export default function Reveal({
  parts,
  as: Tag = "div",
  by = "word",
  className,
}: {
  parts: RevealPart[]
  as?: ElementType
  by?: "letter" | "word"
  className?: string
}) {
  const ref = useInViewFlag<HTMLElement>()
  let index = 0

  return (
    <Tag ref={ref} className={className}>
      <span className="sr-only">{parts.map((part) => part.text).join(" ")}</span>
      <span aria-hidden="true">
        {parts.map((part, partIndex) => (
          <span key={partIndex} className={part.accent ? "accent" : undefined}>
            {part.text.split(" ").map((word, wordIndex) => (
              <span key={wordIndex}>
                {by === "word" ? (
                  <span className="r-unit" style={{ "--i": index++ } as React.CSSProperties}>
                    {word}
                  </span>
                ) : (
                  <span className="inline-block whitespace-nowrap">
                    {word.split("").map((letter, letterIndex) => (
                      <span key={letterIndex} className="r-unit" style={{ "--i": index++ } as React.CSSProperties}>
                        {letter}
                      </span>
                    ))}
                  </span>
                )}{" "}
              </span>
            ))}
          </span>
        ))}
      </span>
    </Tag>
  )
}
