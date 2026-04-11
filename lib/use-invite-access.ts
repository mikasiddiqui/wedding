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

const inviteAccessCache = new Map<string, InviteApiResponse | null>()
const inviteAccessRequests = new Map<string, Promise<InviteApiResponse | null>>()

const getInviteAccessKey = (apiUrl: string, inviteId: string) => `${apiUrl}::${inviteId}`

const parseInviteAccess = (requestedInviteId: string, data: InviteApiResponse | null) => {
  const people = Array.isArray(data?.people) ? data.people : []

  if (people.length === 0) {
    return {
      inviteId: undefined,
      guestTitle: undefined,
      rsvpClosed: false,
    }
  }

  return {
    inviteId: requestedInviteId,
    guestTitle: typeof data?.title === "string" ? data.title : undefined,
    rsvpClosed: isClosedRsvp(data?.close_rsvp_button ?? data?.closeRsvpButton),
  }
}

const fetchInviteAccess = async (apiUrl: string, inviteId: string) => {
  const key = getInviteAccessKey(apiUrl, inviteId)
  const cached = inviteAccessCache.get(key)

  if (cached !== undefined) return cached

  const pending = inviteAccessRequests.get(key)
  if (pending) return pending

  const request = fetch(`${apiUrl}?inviteId=${encodeURIComponent(inviteId)}`)
    .then(async (res) => {
      if (!res.ok) return null
      return (await res.json()) as InviteApiResponse
    })
    .then((data) => {
      inviteAccessCache.set(key, data)
      inviteAccessRequests.delete(key)
      return data
    })
    .catch((error) => {
      inviteAccessRequests.delete(key)
      throw error
    })

  inviteAccessRequests.set(key, request)
  return request
}

export function useInviteAccess() {
  const apiUrl = process.env.NEXT_PUBLIC_RSVP_API_URL
  const [requestedInviteId] = useState<string | undefined>(() => {
    if (typeof window === "undefined") return undefined
    return new URLSearchParams(window.location.search).get("invite") ?? undefined
  })
  const initialInviteAccess =
    requestedInviteId && apiUrl
      ? parseInviteAccess(
          requestedInviteId,
          inviteAccessCache.get(getInviteAccessKey(apiUrl, requestedInviteId)) ?? null
        )
      : { inviteId: undefined, guestTitle: undefined, rsvpClosed: false }
  const [inviteId, setInviteId] = useState<string | undefined>(initialInviteAccess.inviteId)
  const [inviteLookupPending, setInviteLookupPending] = useState(
    Boolean(
      requestedInviteId &&
        apiUrl &&
        !inviteAccessCache.has(getInviteAccessKey(apiUrl, requestedInviteId))
    )
  )
  const [guestTitle, setGuestTitle] = useState<string | undefined>(initialInviteAccess.guestTitle)
  const [rsvpClosed, setRsvpClosed] = useState(initialInviteAccess.rsvpClosed)
  const inviteQueryPresent = Boolean(requestedInviteId)

  useEffect(() => {
    if (!requestedInviteId || !apiUrl) return

    let active = true

    fetchInviteAccess(apiUrl, requestedInviteId)
      .then((data) => {
        if (!active) return
        const next = parseInviteAccess(requestedInviteId, data)
        setInviteId(next.inviteId)
        setGuestTitle(next.guestTitle)
        setRsvpClosed(next.rsvpClosed)
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
