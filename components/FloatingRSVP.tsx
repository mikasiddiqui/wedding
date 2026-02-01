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

      const formData = new FormData()
      formData.append("entry.841311756", guestName)
      formData.append("entry.459515270", inviteId)
      formData.append(
        "entry.1705854182",
        `RSVP button clicked by ${guestName} (${window.location.href})`
      )

      await fetch(
        "https://docs.google.com/forms/d/e/1FAIpQLSdFud7A7ipTA5ZCBSMpr5ceo1CCAIjvCdM051QAUDU0xRnvDg/formResponse",
        {
          method: "POST",
          mode: "no-cors",
          body: formData,
        }
      )

      setSent(true)
      setTimeout(() => setSent(false), 2000)
    } catch (e) {
      alert("Couldn’t send RSVP. Please try again.")
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
