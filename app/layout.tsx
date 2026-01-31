import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import RoseBackground from "@/components/RoseBackground"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Menu, X } from "lucide-react"

const love = localFont({
  src: "./fonts/Love.otf",
  display: "swap",
})

const brandon = localFont({
  src: "./fonts/brandon-bold.otf",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Mika & Darshika",
  description: "Wedding website",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${love.className} min-h-screen bg-[#c98f96] text-white antialiased`}
      >
        <RoseBackground />

        <header className="relative z-40 grid grid-cols-3 items-center px-10 h-[96px]">
          <div className="flex items-center">
            <div className="text-lg tracking-wide">
              M<span className="opacity-70">&</span>D
            </div>
          </div>


          <div className="flex items-center justify-center pt-4">
            <Button
              className={`${brandon.className}
      h-12
      rounded-full
      px-12
      text-lg tracking-widest
      bg-white
      text-black/70
      hover:bg-white/60
    `}
            >
              RSVP
            </Button>
          </div>


          <div className="flex items-center justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex h-12 w-12 items-center justify-center">
                  <Menu className="h-10 w-10 stroke-[1.5]" />
                </button>
              </DialogTrigger>


              <DialogContent
                fullScreen
                showCloseButton={false}
                className="bg-white text-black"
              >
                <DialogTitle className="sr-only">
                  Navigation menu
                </DialogTitle>

                <div className="flex h-[96px] items-center justify-between px-10">
                  <div className="text-lg tracking-wide">
                    M<span className="opacity-70">&</span>D
                  </div>

                  <DialogClose asChild>
                    <button className="flex h-14 w-14 items-center justify-center">
                      <X className="h-10 w-10 stroke-[1.5]" />
                    </button>
                  </DialogClose>
                </div>


                <div className="px-12 pt-24">
                  <nav className="space-y-10 text-[clamp(3.5rem,8vw,6rem)] leading-none">
                    <a href="#" className="block">TRAVEL</a>
                    <a href="#" className="block">REGISTRY</a>
                    <a href="#" className="block">DETAILS</a>
                  </nav>
                </div>

              </DialogContent>
            </Dialog>
          </div>
        </header>

        {children}
      </body>
    </html>
  )
}

