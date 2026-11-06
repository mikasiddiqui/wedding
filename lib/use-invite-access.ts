import { useSyncExternalStore } from "react"

export type InvitePerson = {
  name: string
  confirmed?: number | boolean | string | null
}

export type InviteRecord = {
  title?: string
  people?: InvitePerson[]
  close_rsvp_button?: unknown
  closeRsvpButton?: unknown
  /**
   * The venue address. Only the RSVP API may supply this, and only for invites
   * with a confirmed guest. Never hard-code it: this site is a static export, so
   * anything in the source is readable by anyone, invited or not.
   */
  address?: unknown
}

type InviteState = {
  requestedInviteId?: string
  record: InviteRecord | null
  /** True only while there is nothing to show yet; cached data revalidates silently. */
  loading: boolean
  error: string | null
}

const STORAGE_PREFIX = "wedding-invite:v1:"
const apiUrl = process.env.NEXT_PUBLIC_RSVP_API_URL
const apiToken = process.env.NEXT_PUBLIC_RSVP_API_TOKEN

const serverState: InviteState = { record: null, loading: false, error: null }
const listeners = new Set<() => void>()
let state: InviteState | null = null
let pendingRequest: Promise<void> | null = null
let hasRequested = false

const readCache = (inviteId: string): InviteRecord | null => {
  try {
    const stored = window.localStorage.getItem(STORAGE_PREFIX + inviteId)
    return stored ? (JSON.parse(stored) as InviteRecord) : null
  } catch {
    return null
  }
}

const writeCache = (inviteId: string, record: InviteRecord | null) => {
  try {
    if (record && Array.isArray(record.people) && record.people.length > 0) {
      window.localStorage.setItem(STORAGE_PREFIX + inviteId, JSON.stringify(record))
    } else {
      window.localStorage.removeItem(STORAGE_PREFIX + inviteId)
    }
  } catch {
    // Storage can be unavailable (private mode); the network copy still works.
  }
}

const getState = (): InviteState => {
  if (state) return state
  const requestedInviteId =
    new URLSearchParams(window.location.search).get("invite") ?? undefined
  const record = requestedInviteId && apiUrl ? readCache(requestedInviteId) : null
  state = {
    requestedInviteId,
    record,
    loading: Boolean(requestedInviteId && apiUrl && !record),
    error: null,
  }
  return state
}

const setState = (next: Partial<InviteState>) => {
  state = { ...getState(), ...next }
  listeners.forEach((listener) => listener())
}

/** Re-reads the invite from the API. Everything using the hook updates together. */
export function refreshInviteAccess(): Promise<void> {
  const { requestedInviteId, record } = getState()
  if (!requestedInviteId || !apiUrl) return Promise.resolve()
  if (pendingRequest) return pendingRequest

  hasRequested = true
  setState({ loading: !record, error: null })

  pendingRequest = fetch(`${apiUrl}?inviteId=${encodeURIComponent(requestedInviteId)}`, {
    headers: apiToken ? { "X-Invite-Token": apiToken } : undefined,
  })
    .then(async (res) => {
      if (!res.ok) throw new Error("Failed to load RSVP data.")
      return (await res.json()) as InviteRecord
    })
    .then((nextRecord) => {
      writeCache(requestedInviteId, nextRecord)
      setState({ record: nextRecord, loading: false, error: null })
    })
    .catch((error: unknown) => {
      // Keep any cached copy, so patchy reception on the day doesn't lose the details.
      setState({
        loading: false,
        error: error instanceof Error && error.message ? error.message : "Unable to load RSVP data.",
      })
    })
    .finally(() => {
      pendingRequest = null
    })

  return pendingRequest
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  if (!hasRequested) void refreshInviteAccess()
  return () => {
    listeners.delete(listener)
  }
}

export const normalizeConfirmed = (value: unknown): boolean | null => {
  if (value === null || value === undefined) return null
  if (typeof value === "string") {
    const trimmed = value.trim()
    if (!trimmed) return null
    if (trimmed === "1") return true
    if (trimmed === "0") return false
    const num = Number(trimmed)
    return Number.isNaN(num) ? Boolean(trimmed) : Boolean(num)
  }
  if (typeof value === "number") return value !== 0
  if (typeof value === "boolean") return value
  return Boolean(value)
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

/** The raw invite, for the RSVP form. */
export function useInviteRecord() {
  return useSyncExternalStore(subscribe, getState, () => serverState)
}

export function useInviteAccess() {
  const { requestedInviteId, record, loading } = useInviteRecord()
  const people = Array.isArray(record?.people) ? record.people : []
  const isValid = Boolean(requestedInviteId) && people.length > 0
  const attending =
    isValid && people.some((person) => normalizeConfirmed(person?.confirmed) === true)
  const address = typeof record?.address === "string" ? record.address.trim() : ""

  return {
    inviteId: isValid ? requestedInviteId : undefined,
    inviteQueryPresent: Boolean(requestedInviteId),
    inviteLookupPending: loading,
    guestTitle: isValid && typeof record?.title === "string" ? record.title : undefined,
    rsvpClosed: isValid && isClosedRsvp(record?.close_rsvp_button ?? record?.closeRsvpButton),
    attending,
    venueAddress: attending && address ? address : undefined,
  }
}
