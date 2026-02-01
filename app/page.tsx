"use client"

import { useEffect, useState } from "react"
import invites from "@/app/data/invites.json"

export default function Home() {
  const [guestName, setGuestName] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const inviteId = params.get("invite")

    if (inviteId && inviteId in invites) {
      setGuestName(invites[inviteId as keyof typeof invites])
    }
  }, [])

  return (
    <main className="relative px-6">

      {/* HERO (unchanged) */}
      <div className="relative flex items-center justify-center pt-8 pb-80">
        <div className="relative w-full max-w-[92vw] text-center">

          {/* Date */}
          <div
            className="
              mb-6
              text-[clamp(2.2rem,5vw,4rem)]
              tracking-[0.28em]
              uppercase
              text-white
              [text-rendering:optimizeLegibility]
              [-webkit-text-stroke:0.3px_rgba(255,255,255,0.9)]
            "
          >
            January 9th 2027
          </div>

          {/* Mika */}
          <div
            className="
              relative z-10
              text-[clamp(5.6rem,17vw,10.5rem)]
              tracking-tight
              translate-x-[-0.75rem]
            "
          >
            Mika
          </div>

          {/* Ampersand */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span
              className="
                relative
                top-[3rem]
                leading-none
                opacity-60
                text-[clamp(7.4rem,20vw,15rem)]
              "
            >
              &
            </span>
          </div>

          {/* Darshika */}
          <div
            className="
              relative z-10 mt-[-1.6rem]
              text-[clamp(5.6rem,17vw,10.5rem)]
              tracking-tight
              translate-x-[0.75rem]
            "
          >
            Darshika
          </div>

        </div>
      </div>

      {/* NEXT CONTENT */}
      <div className="relative flex items-center justify-center py-40">
        <div
          className="
            text-center
            text-[clamp(5.6rem,17vw,10.5rem)]
            tracking-tight
            text-white
          "
        >
          {guestName ? `Hi ${guestName}!` : "Hi there!"}
        </div>
      </div>

    </main>
  )
}
