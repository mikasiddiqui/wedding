"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog"
import { Menu, X } from "lucide-react"
import FloatingRSVP from "@/components/FloatingRSVP"
import invites from "@/app/data/invites.json"


export default function Header() {
  const [open, setOpen] = useState(false)
  const [inviteId, setInviteId] = useState<string | undefined>(undefined)
  const [guestTitle, setGuestTitle] = useState<string | undefined>(undefined)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get("invite") ?? undefined
    if (id && id in invites) {
      setInviteId(id)
      setGuestTitle((invites as Record<string, { title: string }>)[id]?.title)
    } else {
      setInviteId(undefined)
      setGuestTitle(undefined)
    }
  }, [])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 grid h-[96px] grid-cols-2 items-center px-10">
        <div className={`text-lg font-semibold tracking-wide text-rose-950/80`}>
          M
          <span className="mx-0.5 font-semibold text-red-800/80">&</span>
          D
        </div>

        <div className="flex justify-end">
          <Dialog onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="flex h-12 w-12 items-center justify-center">
                <Menu className="h-10 w-10 stroke-[1.5]" />
              </button>
            </DialogTrigger>

            <DialogContent fullScreen showCloseButton={false} className="bg-rose-200">
              <DialogTitle className="sr-only">Navigation menu</DialogTitle>

              <div className="grid h-[96px] grid-cols-2 items-center px-10">
                <div className={`text-lg font-semibold tracking-wide text-rose-950/80`}>
                  M
                  <span className="mx-0.5 font-semibold text-red-700/80">&</span>
                  D
                </div>

                <div className="flex justify-end">
                  <DialogClose asChild>
                    <button className="flex h-14 w-14 items-center justify-center">
                      <X className="h-10 w-10 stroke-[1.5] text-rose-900" />
                    </button>
                  </DialogClose>
                </div>
              </div>

              <div className="px-12 pt-24">
                <nav className="space-y-10 text-[clamp(3.5rem,8vw,6rem)] text-rose-900 leading-none">
                  <DialogClose asChild>
                    <a href="#invitation" className="block">INVITATION</a>
                  </DialogClose>
                  <DialogClose asChild>
                    <a href="#schedule" className="block">SCHEDULE</a>
                  </DialogClose>
                  <DialogClose asChild>
                    <a href="#faq" className="block">FAQ</a>
                  </DialogClose>
                </nav>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Floating CTA lives with the state that controls it */}
{inviteId ? (
  <FloatingRSVP dialogOpen={false} inviteId={inviteId} guestName={guestTitle} />
) : null}
    </>
  )
}
