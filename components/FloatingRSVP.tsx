"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { sangbleu } from "../app/fonts"

type Person = { name: string; confirmed?: number | boolean | string | null }
type InviteRecord = { title?: string; people: Person[] }

type FloatingRSVPProps = {
  dialogOpen: boolean
  inviteId?: string
  guestName?: string
}

type RemoteInviteState = {
  invite: InviteRecord | null
  loading: boolean
  error: string | null
  refresh: () => void
}

const buildApiHeaders = (token?: string, contentType?: string) => {
  const headers: Record<string, string> = {}
  if (contentType) headers["Content-Type"] = contentType
  if (token) headers["X-Invite-Token"] = token
  return headers
}

const normalizeConfirmed = (value: unknown): boolean | null => {
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

const useRemoteInvite = (inviteId?: string): RemoteInviteState => {
  const apiUrl = process.env.NEXT_PUBLIC_RSVP_API_URL
  const apiToken = process.env.NEXT_PUBLIC_RSVP_API_TOKEN
  const [invite, setInvite] = useState<InviteRecord | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(() => {
    if (!apiUrl || !inviteId) return
    let active = true
    setLoading(true)
    setError(null)
    fetch(`${apiUrl}?inviteId=${encodeURIComponent(inviteId)}`, {
      method: "GET",
      headers: buildApiHeaders(apiToken),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load RSVP data.")
        return (await res.json()) as InviteRecord
      })
      .then((data) => {
        if (active) setInvite(data)
      })
      .catch((err) => {
        if (active) setError(err.message || "Unable to load RSVP data.")
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [apiUrl, inviteId, apiToken])

  useEffect(() => {
    const cleanup = refresh()
    return () => {
      if (typeof cleanup === "function") cleanup()
    }
  }, [refresh])

  return { invite, loading, error, refresh }
}

export default function FloatingRSVP({
  dialogOpen,
  inviteId = "unknown",
  guestName = "Unknown Guest",
}: FloatingRSVPProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [selected, setSelected] = useState<Record<string, "attending" | "not">>({})
  const [confirmed, setConfirmed] = useState<Record<string, boolean | null>>({})

  const base = `${sangbleu.className} font-medium
    h-12 rounded-full px-12 text-lg tracking-widest transition-colors`

  const hero = "bg-white/80 text-black/70 hover:bg-white"
  const dialog = "bg-red-900/80 text-rose-100 hover:bg-red-900"

  const apiUrl = process.env.NEXT_PUBLIC_RSVP_API_URL
  const apiToken = process.env.NEXT_PUBLIC_RSVP_API_TOKEN
  const {
    invite: remoteInvite,
    loading: remoteLoading,
    error: remoteError,
    refresh: refreshRemoteInvite,
  } = useRemoteInvite(inviteId)
  const inviteTitle = useMemo(() => {
    const remoteTitle = remoteInvite?.title?.trim()
    if (remoteTitle) return remoteInvite?.title ?? guestName
    return guestName
  }, [remoteInvite, guestName])

  const basePeople = useMemo<Person[]>(() => {
    if (!remoteInvite?.people?.length) return []
    const namesAreValid = remoteInvite.people.every(
      (person) => typeof person.name === "string" && person.name.trim().length > 0
    )
    if (namesAreValid) return remoteInvite.people
    return remoteInvite.people.map((person) => ({
      name: person.name,
      confirmed: normalizeConfirmed(person.confirmed ?? null),
    }))
  }, [remoteInvite])
  const people = basePeople

  const remoteNameSet = useMemo(
    () => new Set(remoteInvite?.people?.map((person) => person.name) ?? []),
    [remoteInvite]
  )
  const remoteFetched = Boolean(apiUrl && remoteInvite && !remoteLoading && !remoteError)

  const initialConfirmed = useMemo(() => {
    const next: Record<string, boolean | null> = {}
    people.forEach((person) => {
      next[person.name] = normalizeConfirmed(person.confirmed)
    })
    return next
  }, [people])

  useEffect(() => {
    if (apiUrl) {
      setConfirmed(initialConfirmed)
      return
    }
    const storageKey = inviteId ? `rsvp-confirmed:${inviteId}` : null
    if (!storageKey) {
      setConfirmed(initialConfirmed)
      return
    }
    if (typeof window === "undefined") {
      setConfirmed(initialConfirmed)
      return
    }
    try {
      const stored = window.localStorage.getItem(storageKey)
      const parsed = stored ? (JSON.parse(stored) as Record<string, boolean>) : {}
      setConfirmed({ ...initialConfirmed, ...parsed })
    } catch {
      setConfirmed(initialConfirmed)
    }
  }, [initialConfirmed, apiUrl, inviteId])

  useEffect(() => {
    if (!open) return
    const next: Record<string, "attending" | "not"> = {}
    people.forEach((person) => {
      const known = !remoteFetched || remoteNameSet.has(person.name)
      const status = confirmed[person.name]
      if (!known || status === null || status === undefined) {
        next[person.name] = "attending"
        return
      }
      next[person.name] = status ? "attending" : "not"
    })
    setSelected(next)
  }, [open, people, confirmed, remoteFetched, remoteNameSet])

  const handleConfirm = async () => {
    try {
      setSubmitting(true)
      setSent(false)

      if (apiUrl && inviteId) {
        const postHeaders = apiToken
          ? buildApiHeaders(apiToken, "text/plain;charset=UTF-8")
          : { "Content-Type": "text/plain;charset=UTF-8" }
        const postMode = apiToken ? "cors" : "no-cors"

        const apiResponse = await fetch(apiUrl, {
          method: "POST",
          headers: postHeaders,
          mode: postMode,
          body: JSON.stringify({
            inviteId,
            title: inviteTitle,
            people: people.map((person) => ({
              name: person.name,
              confirmed: selected[person.name] === "attending" ? 1 : 0,
            })),
          }),
        })

        if (apiResponse.type !== "opaque") {
          const responseText = await apiResponse.text()
          const apiJson = (() => {
            try {
              return JSON.parse(responseText)
            } catch {
              return null
            }
          })()
          if (!apiResponse.ok || !apiJson || apiJson?.error) {
            throw new Error(apiJson?.error || "RSVP update failed.")
          }
        }
      }

      setConfirmed((prev) => {
        const next = { ...prev }
        people.forEach((person) => {
          next[person.name] = selected[person.name] === "attending"
        })
      if (!apiUrl) {
        const storageKey = inviteId ? `rsvp-confirmed:${inviteId}` : null
        if (storageKey && typeof window !== "undefined") {
          try {
            window.localStorage.setItem(storageKey, JSON.stringify(next))
          } catch {
              // ignore storage errors
            }
          }
        }
        return next
      })
      setSent(true)
      setOpen(false)
      if (apiUrl) {
        setTimeout(() => {
          refreshRemoteInvite()
        }, 800)
      }
      setTimeout(() => setSent(false), 2000)
    } catch (e) {
      const message =
        e instanceof Error && e.message
          ? e.message
          : "Couldn’t send RSVP. Please try again."
      alert(message)
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-16 md:bottom-20 z-[200] flex justify-center pointer-events-none">
      <div className="pointer-events-auto">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              className={`${base} ${dialogOpen ? dialog : hero}`}
            >
              {submitting ? "SENDING..." : sent ? "SENT!" : "RSVP"}
            </Button>
          </DialogTrigger>
          <DialogContent className={`${sangbleu.className} bg-[#c98f96] text-white border-white/20`}>
            <DialogHeader>
              <DialogTitle className="text-[clamp(1.6rem,3vw,2.2rem)] tracking-tight">
                Confirm your RSVP
              </DialogTitle>
              <DialogDescription className="text-white/80">
                Select who is attending for {inviteTitle}.
                You can update your selection any time and confirm again.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 rounded-[16px] border border-white/20 bg-white/5 px-4 py-4">
              <div className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,0.7fr)_minmax(0,1fr)] items-center gap-2 border-b border-white/10 pb-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:gap-4">
                <div className="text-sm uppercase tracking-[0.2em] text-white/80">
                  Guests
                </div>
                <div className="text-sm uppercase tracking-[0.2em] text-white/80 justify-self-center">
                  Status
                </div>
                <div className="text-sm uppercase tracking-[0.2em] text-white/80">
                  Attending
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {remoteLoading ? (
                  <div className="text-sm text-white/70">Loading guest list…</div>
                ) : (
                  <>
                    {remoteError && (
                      <div className="text-sm text-white/70">
                        Could not load the latest RSVP status. Showing local data.
                      </div>
                    )}
                    {people.map((person, index) => {
                      const isNotConfirmed =
                        remoteFetched &&
                        (!remoteNameSet.has(person.name) ||
                          confirmed[person.name] === null ||
                          confirmed[person.name] === undefined)
                      const isAttending = Boolean(confirmed[person.name])
                      const statusLabel = isNotConfirmed
                        ? "Not confirmed"
                        : isAttending
                        ? "Attending"
                        : "Not attending"

                      return (
                        <div
                          key={`${person.name}-${index}`}
                          className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,0.7fr)_minmax(0,1fr)] items-center gap-2 text-[clamp(1rem,2.3vw,1rem)] sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:gap-4"
                        >
                          <span>{person.name}</span>
                          <span
                            aria-label={statusLabel}
                            title={statusLabel}
                            className={`h-2.5 w-2.5 justify-self-center rounded-full sm:hidden ${
                              isNotConfirmed
                                ? "border border-white/60 bg-transparent"
                                : isAttending
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          />
                          <Badge
                            variant="outline"
                            className={`hidden sm:inline-flex ${
                              isNotConfirmed
                                ? "border-white/30 text-white/70"
                                : isAttending
                                ? "border-white/60 bg-white text-rose-900"
                                : "border-white/30 text-white/70"
                            }`}
                          >
                            {statusLabel}
                          </Badge>
                          <RadioGroup
                            value={selected[person.name]}
                            onValueChange={(value) =>
                              setSelected((prev) => ({
                                ...prev,
                                [person.name]: value as "attending" | "not",
                              }))
                            }
                            disabled={remoteLoading}
                            className="flex items-center gap-4 sm:gap-6"
                          >
                            <div className="flex items-center gap-2">
                              <RadioGroupItem
                                value="attending"
                                id={`${person.name}-attending`}
                                className="border-white text-rose-900 data-[state=checked]:border-white data-[state=checked]:bg-white"
                              />
                              <Label htmlFor={`${person.name}-attending`} className="text-white/90">
                                Yes
                              </Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem
                                value="not"
                                id={`${person.name}-not`}
                                className="border-white text-rose-900 data-[state=checked]:border-white data-[state=checked]:bg-white"
                              />
                              <Label htmlFor={`${person.name}-not`} className="text-white/90">
                                No
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      )
                    })}
                  </>
                )}
              </div>
            </div>

            <DialogFooter className="mt-4 sm:justify-between">
              <DialogClose asChild>
                <Button variant="ghost" className="border border-white">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="default"
                type="button"
                onClick={handleConfirm}
                disabled={submitting || remoteLoading}
                className="bg-white/90 text-black/80 hover:bg-white"
              >
                {submitting ? "SENDING..." : "Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
