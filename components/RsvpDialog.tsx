"use client"

import { useEffect, useMemo, useState } from "react"
import { normalizeConfirmed, refreshInviteAccess, useInviteRecord } from "@/lib/use-invite-access"
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

type RsvpDialogProps = {
  triggerClassName?: string
  triggerLabel?: string
  inviteId?: string
  guestName?: string
}

type RemoteInviteState = {
  invite: InviteRecord | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

const buildApiHeaders = (token?: string, contentType?: string) => {
  const headers: Record<string, string> = {}
  if (contentType) headers["Content-Type"] = contentType
  if (token) headers["X-Invite-Token"] = token
  return headers
}

// Shares the page's invite lookup, and refreshing it updates the page (e.g. the address).
const useRemoteInvite = (): RemoteInviteState => {
  const { record, loading, error } = useInviteRecord()
  const invite = record && Array.isArray(record.people) ? (record as InviteRecord) : null
  return { invite, loading, error, refresh: refreshInviteAccess }
}

export default function RsvpDialog({
  triggerClassName = "pill",
  triggerLabel = "RSVP",
  inviteId = "unknown",
  guestName = "Unknown Guest",
}: RsvpDialogProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [selected, setSelected] = useState<Record<string, "attending" | "not">>({})
  const [confirmed, setConfirmed] = useState<Record<string, boolean | null>>({})

  const apiUrl = process.env.NEXT_PUBLIC_RSVP_API_URL
  const apiToken = process.env.NEXT_PUBLIC_RSVP_API_TOKEN
  const {
    invite: remoteInvite,
    loading: remoteLoading,
    error: remoteError,
    refresh: refreshRemoteInvite,
  } = useRemoteInvite()
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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button type="button" className={`${sangbleu.className} ${triggerClassName}`}>
              {submitting ? "Sending..." : sent ? "Sent!" : triggerLabel}
          </button>
          </DialogTrigger>
          <DialogContent className={`${sangbleu.className} bg-[var(--ground)] text-[var(--ink)] border-[var(--line)]`}>
            <DialogHeader>
              <DialogTitle className="text-[clamp(1.6rem,3vw,2.2rem)] tracking-tight">
                Confirm your RSVP
              </DialogTitle>
              <DialogDescription className="text-[var(--ink)]">
                Select who is attending for {inviteTitle}.
                You can update your selection any time and confirm again.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 border-t border-[var(--line)] pt-4">
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,8.5rem)] items-center gap-2 border-b border-[var(--line)] pb-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:gap-4">
                <div className="text-[0.72rem] uppercase tracking-[0.14em] text-[var(--ink)] sm:text-sm sm:tracking-[0.2em]">
                  Guests
                </div>
                <div className="hidden justify-self-center text-[0.72rem] uppercase tracking-[0.14em] text-[var(--ink)] sm:block sm:text-sm sm:tracking-[0.2em]">
                  Status
                </div>
                <div className="text-[0.72rem] uppercase tracking-[0.14em] text-[var(--ink)] sm:text-sm sm:tracking-[0.2em]">
                  Attending
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {remoteLoading ? (
                  <div className="text-sm text-[var(--ink)]">Loading guest list…</div>
                ) : (
                  <>
                    {remoteError && (
                      <div className="text-sm text-[var(--ink)]">
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
                          className="grid grid-cols-[minmax(0,1fr)_minmax(0,8.5rem)] items-center gap-2 text-[0.95rem] sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:gap-4 sm:text-[clamp(1rem,2.3vw,1rem)]"
                        >
                          <span className="min-w-0 break-words pr-1 leading-tight">{person.name}</span>
                          <Badge
                            variant="outline"
                            className={`hidden sm:inline-flex ${
                              isNotConfirmed
                                ? "border-[var(--line)] text-[var(--ink)]"
                                : isAttending
                                ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--ground)]"
                                : "border-[var(--line)] text-[var(--ink)]"
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
                            className="flex min-w-0 items-center gap-3 sm:gap-6"
                          >
                            <div className="flex items-center gap-1.5">
                              <RadioGroupItem
                                value="attending"
                                id={`${person.name}-attending`}
                                className="border-[var(--ink)] text-[var(--ground)] data-[state=checked]:border-[var(--ink)] data-[state=checked]:bg-[var(--ink)] [&_svg]:fill-[var(--ground)]"
                              />
                              <Label htmlFor={`${person.name}-attending`} className="text-[0.95rem] text-[var(--ink)] sm:text-base">
                                Yes
                              </Label>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <RadioGroupItem
                                value="not"
                                id={`${person.name}-not`}
                                className="border-[var(--ink)] text-[var(--ground)] data-[state=checked]:border-[var(--ink)] data-[state=checked]:bg-[var(--ink)] [&_svg]:fill-[var(--ground)]"
                              />
                              <Label htmlFor={`${person.name}-not`} className="text-[0.95rem] text-[var(--ink)] sm:text-base">
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
                <Button variant="ghost" className="border border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)]/10 hover:text-[var(--ink)]">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="default"
                type="button"
                onClick={handleConfirm}
                disabled={submitting || remoteLoading}
                className="bg-[var(--ink)] text-[var(--ground)] hover:bg-[var(--ink)]/90"
              >
                {submitting ? "SENDING..." : "Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
  )
}
