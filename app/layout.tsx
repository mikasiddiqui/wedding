import type { Metadata, Viewport } from "next"
import "./globals.css"
import { love, sangbleu, script } from "../app/fonts"
import RoseBackground from "@/components/RoseBackground"
import Header from "@/components/Header"

const siteUrl = "https://mikadarshika.com"
const ogImageJpg = `${siteUrl}/og-social.jpg`

export const viewport: Viewport = {
  themeColor: "#8f5560",
}

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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Runs before first paint, so an invite link starts in the guest layout with no shift. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if(new URLSearchParams(location.search).get('invite'))document.documentElement.dataset.guest='1'",
          }}
        />
        <link rel="preload" href="/fonts/wedding-amp.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/* The RSVP API answers from these hosts; connecting early shortens the guest lookup. */}
        <link rel="preconnect" href="https://script.google.com" />
        <link rel="preconnect" href="https://script.googleusercontent.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${love.className} ${love.variable} ${sangbleu.variable} ${script.variable} min-h-screen antialiased`}
      >
        <RoseBackground />
        <div className="grain" aria-hidden="true" />
        <Header />
        {children}
      </body>
    </html>
  )
}
