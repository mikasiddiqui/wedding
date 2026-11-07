"use client"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog"
import { Menu, X } from "lucide-react"
import { sangbleu } from "@/app/fonts"
import RsvpDialog from "@/components/RsvpDialog"

const links = [
  { href: "#invitation", label: "Invitation" },
  { href: "#schedule", label: "Schedule" },
  { href: "#faq", label: "FAQ" },
  { href: "#gallery", label: "Gallery" },
]

type GuestHeaderProps = {
  inviteId: string
  guestName?: string
  rsvpClosed: boolean
}

export default function GuestHeader({ inviteId, guestName, rsvpClosed }: GuestHeaderProps) {
  return (
    <header className="site-header animate-in fade-in duration-1000">
      <a href="#top" aria-label="Back to top" className="font-love justify-self-start text-[2.2rem] leading-none tracking-tight">
        M&amp;D
      </a>

      <nav aria-label="Sections" className={`${sangbleu.className} hidden items-center gap-9 md:flex`}>
        {links.map((link) => (
          <a key={link.href} href={link.href} className="nav-link">
            {link.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center justify-end gap-1">
        {rsvpClosed ? null : <RsvpDialog inviteId={inviteId} guestName={guestName} triggerClassName="pill" triggerLabel="RSVP" />}

        <Dialog>
          <DialogTrigger asChild>
            <button aria-label="Open menu" className="flex size-11 items-center justify-center md:hidden">
              <Menu className="size-7" strokeWidth={1} />
            </button>
          </DialogTrigger>

          <DialogContent fullScreen showCloseButton={false} className="bg-[var(--ground)] text-[var(--ink)]">
            <DialogTitle className="sr-only">Navigation menu</DialogTitle>

            <div className="flex h-[var(--nav-height)] items-center justify-between border-b border-[var(--line)] px-5">
              <span className="font-love text-[2.2rem] leading-none tracking-tight">M&amp;D</span>
              <DialogClose asChild>
                <button aria-label="Close menu" className="flex size-11 items-center justify-center">
                  <X className="size-7" strokeWidth={1} />
                </button>
              </DialogClose>
            </div>

            <nav className="font-love space-y-8 px-5 pt-14 text-[clamp(3rem,15vw,5rem)] uppercase leading-none">
              {links.map((link) => (
                <DialogClose asChild key={link.href}>
                  <a href={link.href} className="block">
                    {link.label}
                  </a>
                </DialogClose>
              ))}
            </nav>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  )
}
