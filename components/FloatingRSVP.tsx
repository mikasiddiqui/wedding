"use client"

import { Button } from "@/components/ui/button"
import { brandon } from "../app/fonts"

export default function FloatingRSVP({
  dialogOpen,
}: {
  dialogOpen: boolean
}) {
  const base = `${brandon.className}
    h-12 rounded-full px-12 text-lg tracking-widest transition-colors`

  const hero = "bg-white/80 text-black/70 hover:bg-white"
  const dialog = "bg-red-900/80 text-rose-100 hover:bg-red-900"

  return (
    <div className="fixed inset-x-0 bottom-16 md:bottom-20 z-[200] flex justify-center pointer-events-none">
      <div className="pointer-events-auto">
        <Button className={`${base} ${dialogOpen ? dialog : hero}`}>
          RSVP
        </Button>
      </div>
    </div>
  )
}
