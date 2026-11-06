"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { useInviteAccess } from "@/lib/use-invite-access"

// Guest-only content is split out, so a visit without an invite loads just the hero.
const GuestSections = dynamic(() => import("@/components/home/GuestSections"), { ssr: false })
const ClosedNotice = dynamic(() => import("@/components/home/ClosedNotice"), { ssr: false })

export default function Home() {
  const [dismissedClosedInviteId, setDismissedClosedInviteId] = useState<string | null>(null)
  const { inviteId, inviteQueryPresent, guestTitle, rsvpClosed, attending, venueAddress } =
    useInviteAccess()

  // Guests who are coming keep the full site after RSVPs close; they need the day's details.
  const showGuestContent = Boolean(inviteId) && (!rsvpClosed || attending)
  const closedNoticeOpen = Boolean(
    rsvpClosed && !attending && inviteId && dismissedClosedInviteId !== inviteId
  )

  // Start fetching the sections while the invite is still being checked.
  useEffect(() => {
    if (inviteQueryPresent) void import("@/components/home/GuestSections")
  }, [inviteQueryPresent])

  return (
    <main
      className={`relative h-[100dvh] px-6 ${
        showGuestContent ? "overflow-y-auto snap-y snap-proximity" : "overflow-hidden"
      }`}
    >
      <div className="relative h-[100dvh] snap-start">
        <div className="grid h-full place-items-center pt-[96px] pb-[calc(12vh+env(safe-area-inset-bottom))] sm:pb-[10vh] md:pb-[12rem] box-border">
          <div className="relative w-full max-w-[92vw] text-center">
            {/* Date */}
            <div
              className="
                hero-rise [--delay:0ms]
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
                hero-rise [--delay:90ms]
                relative z-10
                text-[clamp(4.4rem,15vw,10.5rem)]
                sm:text-[clamp(5.6rem,17vw,10.5rem)]
                tracking-tight
                translate-x-0
                sm:translate-x-[-0.75rem]
              "
            >
              Mika
            </div>

            {/* Ampersand */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span
                className="
                  hero-rise [--delay:180ms] [--rest-opacity:0.6]
                  relative
                  top-[3rem]
                  leading-none
                  text-[clamp(7.4rem,20vw,15rem)]
                "
              >
                &
              </span>
            </div>

            {/* Darshika */}
            <div
              className="
                hero-rise [--delay:270ms]
                relative z-10 mt-[-1rem]
                sm:mt-[-1.6rem]
                text-[clamp(4.4rem,15vw,10.5rem)]
                sm:text-[clamp(5.6rem,17vw,10.5rem)]
                tracking-tight
                translate-x-0
                sm:translate-x-[0.75rem]
              "
            >
              Darshika
            </div>
          </div>
        </div>
      </div>

      {closedNoticeOpen && inviteId ? (
        <ClosedNotice onDismiss={() => setDismissedClosedInviteId(inviteId)} />
      ) : null}

      {showGuestContent && inviteId ? (
        <GuestSections
          inviteId={inviteId}
          guestName={guestTitle}
          rsvpClosed={rsvpClosed}
          attending={attending}
          venueAddress={venueAddress}
        />
      ) : null}
    </main>
  )
}
