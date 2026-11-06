"use client"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog"
import { Menu, X } from "lucide-react"

export default function GuestHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 grid h-[96px] grid-cols-2 items-center px-10 animate-in fade-in duration-500 bg-gradient-to-b from-[#be7f87] from-55% to-[#be7f87]/0">
      <div className="text-lg font-semibold tracking-wide text-white">
        M
        <span className="mx-0.5 font-semibold">&</span>
        D
      </div>

      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <button aria-label="Open menu" className="flex h-12 w-12 items-center justify-center">
              <Menu className="h-10 w-10 stroke-[1.5]" />
            </button>
          </DialogTrigger>

          <DialogContent fullScreen showCloseButton={false} className="bg-[#996470] text-white">
            <DialogTitle className="sr-only">Navigation menu</DialogTitle>

            <div className="grid h-[96px] grid-cols-2 items-center px-10">
              <div className="text-lg font-semibold tracking-wide text-white">
                M
                <span className="mx-0.5 font-semibold">&</span>
                D
              </div>

              <div className="flex justify-end">
                <DialogClose asChild>
                  <button aria-label="Close menu" className="flex h-14 w-14 items-center justify-center">
                    <X className="h-10 w-10 stroke-[1.5] text-white" />
                  </button>
                </DialogClose>
              </div>
            </div>

            <div className="px-12 pt-14 sm:pt-24">
              <nav className="space-y-10 text-[clamp(3.5rem,8vw,6rem)] text-white leading-none">
                <DialogClose asChild>
                  <a href="#invitation" className="block">INVITATION</a>
                </DialogClose>
                <DialogClose asChild>
                  <a href="#schedule" className="block">SCHEDULE</a>
                </DialogClose>
                <DialogClose asChild>
                  <a href="#faq" className="block">FAQ</a>
                </DialogClose>
                <DialogClose asChild>
                  <a href="#gallery" className="block">GALLERY</a>
                </DialogClose>
              </nav>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  )
}
