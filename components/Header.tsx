"use client"

import dynamic from "next/dynamic"
import { useInviteAccess } from "@/lib/use-invite-access"

// Loaded only for validated guests, so a plain visit doesn't pay for the dialog code.
const GuestHeader = dynamic(() => import("@/components/GuestHeader"), { ssr: false })

export default function Header() {
  const { inviteId, guestTitle, rsvpClosed, attending } = useInviteAccess()

  if (!inviteId || (rsvpClosed && !attending)) {
    return null
  }

  return <GuestHeader inviteId={inviteId} guestName={guestTitle} rsvpClosed={rsvpClosed} />
}
