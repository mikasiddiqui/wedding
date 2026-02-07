"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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
import invites from "@/app/data/invites.json"
import { sangbleu } from "../app/fonts"

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
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({})
  const [remoteInvite, setRemoteInvite] = useState<InviteRecord | null>(null)
  const [remoteLoading, setRemoteLoading] = useState(false)
  const [remoteError, setRemoteError] = useState<string | null>(null)

  const base = `${sangbleu.className} font-medium
    h-12 rounded-full px-12 text-lg tracking-widest transition-colors`

  const hero = "bg-white/80 text-black/70 hover:bg-white"
  const dialog = "bg-red-900/80 text-rose-100 hover:bg-red-900"

  type Person = { name: string; confirmed?: number | boolean }
  type InviteRecord = { title?: string; people: Person[] }

  const apiUrl = process.env.NEXT_PUBLIC_RSVP_API_URL
  const localInvite = (invites as Record<string, InviteRecord>)[inviteId]

  useEffect(() => {
    if (!apiUrl || !inviteId) return
    let active = true
    setRemoteLoading(true)
    setRemoteError(null)
    fetch(`${apiUrl}?inviteId=${encodeURIComponent(inviteId)}`, {
      method: "GET",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load RSVP data.")
        return (await res.json()) as InviteRecord
      })
      .then((data) => {
        if (active) setRemoteInvite(data)
      })
      .catch((err) => {
        if (active) setRemoteError(err.message || "Unable to load RSVP data.")
      })
      .finally(() => {
        if (active) setRemoteLoading(false)
      })

    return () => {
      active = false
    }
  }, [apiUrl, inviteId])

  const basePeople = useMemo<Person[]>(() => {
    if (localInvite?.people?.length) return localInvite.people
    if (guestName) return [{ name: guestName }]
    return []
  }, [localInvite, guestName])

  const people = useMemo<Person[]>(() => {
    if (!remoteInvite?.people?.length) return basePeople
    const namesAreValid = remoteInvite.people.every(
      (person) => typeof person.name === "string" && person.name.trim().length > 0
    )
    if (namesAreValid) return remoteInvite.people
    return basePeople.map((person, index) => ({
      name: person.name,
      confirmed: remoteInvite.people[index]?.confirmed ?? person.confirmed,
    }))
  }, [remoteInvite, basePeople])

  const initialConfirmed = useMemo(() => {
    const next: Record<string, boolean> = {}
    people.forEach((person) => {
      next[person.name] = Boolean(person.confirmed)
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
    const next: Record<string, boolean> = {}
    if (Object.keys(confirmed).length) {
      people.forEach((person) => {
        next[person.name] = Boolean(confirmed[person.name])
      })
    } else {
      people.forEach((person) => {
        next[person.name] = true
      })
    }
    setSelected(next)
  }, [open, people, confirmed])

  const allSelected =
    people.length > 0 && people.every((person) => selected[person.name])

  const handleSelectAll = (checked: boolean) => {
    const next: Record<string, boolean> = {}
    people.forEach((person) => {
      next[person.name] = checked
    })
    setSelected(next)
  }

  const handleConfirm = async () => {
    try {
      setSubmitting(true)
      setSent(false)

      const selectedPeople = people
        .filter((person) => selected[person.name])
        .map((person) => person.name)

      const formData = new FormData()
      formData.append(
        "entry.841311756",
        remoteInvite?.title ?? localInvite?.title ?? guestName
      )
      formData.append("entry.459515270", inviteId)
      formData.append(
        "entry.1705854182",
        `RSVP confirmed for ${selectedPeople.join(", ")} — ${
          remoteInvite?.title ?? localInvite?.title ?? guestName
        } (${window.location.href})`
      )

      if (apiUrl && inviteId) {
      const apiResponse = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify({
          inviteId,
          title: remoteInvite?.title ?? localInvite?.title ?? guestName,
          people: people.map((person) => ({
            name: person.name,
            confirmed: selected[person.name] ? 1 : 0,
          })),
        }),
      })

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

      setConfirmed((prev) => {
        const next = { ...prev }
        people.forEach((person) => {
          next[person.name] = Boolean(selected[person.name])
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
                Select who is attending for {remoteInvite?.title ?? localInvite?.title ?? guestName}.
                You can update your selection any time and confirm again.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 rounded-[16px] border border-white/20 bg-white/5 px-4 py-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="text-sm uppercase tracking-[0.2em] text-white/80">
                  Guests
                </div>
                <label className="flex items-center gap-2 text-sm text-white/90">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={(value) => handleSelectAll(Boolean(value))}
                    disabled={remoteLoading}
                    className="bg-white text-rose-900 data-[state=checked]:bg-white data-[state=checked]:text-rose-900 border-white/80"
                  />
                  Select all
                </label>
              </div>
              <div className="mt-4 space-y-3">
                {remoteLoading ? (
                  <div className="text-sm text-white/70">Loading guest list…</div>
                ) : (
                  <>
                    {remoteError && (
                      <div className="text-sm text-white/70">
                        Couldn’t load the latest RSVP status. Showing local data.
                      </div>
                    )}
                    {people.map((person, index) => (
                      <div
                        key={`${person.name}-${index}`}
                        className="flex items-center justify-between text-[clamp(1rem,2.3vw,1.4rem)]"
                      >
                        <div className="flex items-center gap-3">
                          <span>{person.name}</span>
                          <Badge
                            variant="outline"
                            className={
                              confirmed[person.name]
                                ? "border-white/60 bg-white text-rose-900"
                                : "border-white/30 text-white/70"
                            }
                          >
                            {confirmed[person.name] ? "Confirmed" : "Not confirmed"}
                          </Badge>
                        </div>
                        <Checkbox
                          checked={Boolean(selected[person.name])}
                          onCheckedChange={(value) =>
                            setSelected((prev) => ({
                              ...prev,
                              [person.name]: Boolean(value),
                            }))
                          }
                          disabled={remoteLoading}
                          className="bg-white text-rose-900 data-[state=checked]:bg-white data-[state=checked]:text-rose-900 border-white/80"
                        />
                      </div>
                    ))}
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
