"use client"

import { useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog"
import { Menu, X } from "lucide-react"
import FloatingRSVP from "@/components/FloatingRSVP"


export default function Header() {
  const [open, setOpen] = useState(false)

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
                  <a href="#" className="block">TRAVEL</a>
                  <a href="#" className="block">REGISTRY</a>
                  <a href="#" className="block">DETAILS</a>
                </nav>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Floating CTA lives with the state that controls it */}
<FloatingRSVP dialogOpen={false} inviteId="jane-doe" guestName="Jane and Doe" />
    </>
  )
}
