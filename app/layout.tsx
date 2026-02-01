import type { Metadata } from "next"
import "./globals.css"
import { love } from "../app/fonts"
import RoseBackground from "@/components/RoseBackground"
import Header from "@/components/Header"


export const metadata: Metadata = {
  title: "Mika & Darshika",
  description: "Wedding website",
  robots: {
    index: false,
    follow: false,
  },
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
        <Header />
        {children}
      </body>
    </html>
  )
}
