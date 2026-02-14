import type { Metadata } from "next"
import "./globals.css"
import { love } from "../app/fonts"
import RoseBackground from "@/components/RoseBackground"
import Header from "@/components/Header"

const siteUrl = "https://mikadarshika.com"
const ogImageJpg = `${siteUrl}/og-social.jpg`

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Mika & Darshika",
  description: "Mika and Darshika's wedding. RSVP online.",
  manifest: "/favicon/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon.ico" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Mika & Darshika",
    title: "Mika & Darshika",
    description: "Mika and Darshika's wedding. RSVP online.",
    images: [
      {
        url: ogImageJpg,
        secureUrl: ogImageJpg,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Mika & Darshika",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mika & Darshika",
    description: "Mika and Darshika's wedding. RSVP online.",
    images: [
      {
        url: ogImageJpg,
        width: 1200,
        height: 630,
        alt: "Mika & Darshika",
      },
    ],
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  other: {
    bingbot: "noindex, nofollow",
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
