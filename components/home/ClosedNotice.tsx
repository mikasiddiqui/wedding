"use client"

import { sangbleu } from "@/app/fonts"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function ClosedNotice({ onDismiss }: { onDismiss: () => void }) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onDismiss()
      }}
    >
      <DialogContent className="border-white/20 bg-[#996470] text-white">
        <DialogHeader>
          <DialogTitle className={`${sangbleu.className} text-[clamp(1.6rem,3vw,2.2rem)] tracking-tight`}>
            Online RSVP Has Closed
          </DialogTitle>
          <DialogDescription
            className={`${sangbleu.className} text-[clamp(1rem,2.1vw,1.2rem)] leading-relaxed text-white`}
          >
            Thank you for checking in with us. Online RSVPs for this invitation are now
            closed. If you need to confirm or update your attendance, please message Mika
            &amp; Darshika directly.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 sm:justify-end">
          <DialogClose asChild>
            <Button
              variant="default"
              type="button"
              className={`${sangbleu.className} bg-white/90 text-black/80 hover:bg-white`}
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
