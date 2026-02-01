"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { brandon } from "../app/fonts"

type FloatingRSVPProps = {
  dialogOpen: boolean
  inviteId?: string
  guestName?: string
}

export default function FloatingRSVP({
  dialogOpen,
  inviteId = "unknown",
  guestName = "Unknown Guest",
}: FloatingRSVPProps) {
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const base = `${brandon.className}
    h-12 rounded-full px-12 text-lg tracking-widest transition-colors`

  const hero = "bg-white/80 text-black/70 hover:bg-white"
  const dialog = "bg-red-900/80 text-rose-100 hover:bg-red-900"

  const handleClick = async () => {
    try {
      setSubmitting(true)
      setSent(false)

      const res = await fetch("https://formspree.io/f/xojljvjr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: "rsvp@mikadarshika.com",
          _subject: `RSVP received — ${guestName}`,
          invite_id: inviteId,
          guest_name: guestName,
          message: `RSVP button clicked by ${guestName}`,
          source: window.location.href,
        }),
      })

      if (!res.ok) throw new Error("Formspree request failed")

      setSent(true)
      setTimeout(() => setSent(false), 2000)
    } catch (e) {
      alert("Couldn’t send RSVP test. Check Formspree + console.")
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-16 md:bottom-20 z-[200] flex justify-center pointer-events-none">
      <div className="pointer-events-auto">
        <Button
          type="button"
          onClick={handleClick}
          disabled={submitting}
          className={`${base} ${dialogOpen ? dialog : hero}`}
        >
          {submitting ? "SENDING..." : sent ? "SENT!" : "RSVP"}
        </Button>
      </div>
    </div>
  )
}
