import { useEffect, useState } from "react"

type InviteApiResponse = {
  title?: string
  people?: unknown[]
  close_rsvp_button?: unknown
  closeRsvpButton?: unknown
}

const isClosedRsvp = (value: unknown) => {
  if (value === true) return true
  if (typeof value === "number") return value === 1
  if (typeof value === "string") {
    const trimmed = value.trim().toLowerCase()
    return trimmed === "1" || trimmed === "true"
  }
  return false
}

export function useInviteAccess() {
  const apiUrl = process.env.NEXT_PUBLIC_RSVP_API_URL
  const [requestedInviteId] = useState<string | undefined>(() => {
    if (typeof window === "undefined") return undefined
    return new URLSearchParams(window.location.search).get("invite") ?? undefined
  })
  const [inviteId, setInviteId] = useState<string | undefined>(undefined)
  const [inviteLookupPending, setInviteLookupPending] = useState(
    Boolean(requestedInviteId && apiUrl)
  )
  const [guestTitle, setGuestTitle] = useState<string | undefined>(undefined)
  const [rsvpClosed, setRsvpClosed] = useState(false)
  const inviteQueryPresent = Boolean(requestedInviteId)

  useEffect(() => {
    if (!requestedInviteId || !apiUrl) return

    let active = true

    fetch(`${apiUrl}?inviteId=${encodeURIComponent(requestedInviteId)}`)
      .then(async (res) => {
        if (!res.ok) return null
        return (await res.json()) as InviteApiResponse
      })
      .then((data) => {
        if (!active) return

        const people = Array.isArray(data?.people) ? data.people : []
        if (people.length === 0) {
          setInviteId(undefined)
          setGuestTitle(undefined)
          setRsvpClosed(false)
          return
        }

        setInviteId(requestedInviteId)
        setGuestTitle(typeof data?.title === "string" ? data.title : undefined)
        setRsvpClosed(isClosedRsvp(data?.close_rsvp_button ?? data?.closeRsvpButton))
      })
      .catch(() => {
        if (!active) return
        setInviteId(undefined)
        setGuestTitle(undefined)
        setRsvpClosed(false)
      })
      .finally(() => {
        if (active) setInviteLookupPending(false)
      })

    return () => {
      active = false
    }
  }, [apiUrl, requestedInviteId])

  return {
    inviteId,
    inviteQueryPresent,
    inviteLookupPending,
    guestTitle,
    rsvpClosed,
  }
}
