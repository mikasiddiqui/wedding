"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { useInviteAccess } from "@/lib/use-invite-access"

// Guest-only content is split out, so a visit without an invite loads just the hero.
const GuestSections = dynamic(() => import("@/components/home/GuestSections"), { ssr: false })
const ClosedNotice = dynamic(() => import("@/components/home/ClosedNotice"), { ssr: false })

function Letters({ word, start }: { word: string; start: number }) {
  return (
    <>
      {word.split("").map((letter, index) => (
        <span key={index} className="r-unit" style={{ "--i": start + index } as React.CSSProperties}>
          {letter}
        </span>
      ))}
    </>
  )
}

export default function Home() {
  const [dismissedClosedInviteId, setDismissedClosedInviteId] = useState<string | null>(null)
  const { inviteId, inviteQueryPresent, inviteLookupPending, guestTitle, rsvpClosed, attending, venueAddress } =
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

  // The script in layout.tsx assumes an invite link is valid, so nothing shifts when it is.
  useEffect(() => {
    if (inviteLookupPending) return
    if (showGuestContent) document.documentElement.dataset.guest = "1"
    else delete document.documentElement.dataset.guest
  }, [inviteLookupPending, showGuestContent])

  return (
    <main id="top" className="relative">
      <div className="hero">
        <div className="hero-meta">
          <span>The wedding of</span>
          <span>Saturday, 9 January 2027</span>
        </div>
        <h1 className="hero-names" data-inview="true" aria-label="Mika and Darshika">
          <span aria-hidden="true" className="hero-line">
            <Letters word="Mika" start={0} />
            <span className="hero-and">
              <Letters word="&" start={4} />
            </span>
          </span>
          <span aria-hidden="true" className="hero-line hero-line-end">
            <Letters word="Darshika" start={5} />
          </span>
        </h1>
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
