import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "./cross-platform.css"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartProvider } from "@/lib/cart-context"
import { CustomThemeProvider } from "@/lib/theme-context"
import { ScrollToTop } from "@/components/scroll-to-top"
import { ScrollRestoration } from "@/components/scroll-restoration"

// Optimize font loading with display swap
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "Echaly - Elegant Women's Clothing",
  description:
    "Discover elegant and timeless women's fashion at Echaly. Shop our curated collection of dresses for every occasion, featuring high-quality fabrics and exquisite designs.",
  applicationName: "Echaly",
  keywords: ["women's clothing", "dresses", "fashion", "elegant clothing", "Moroccan fashion"],
  authors: [{ name: "Echaly" }],
  openGraph: {
    title: "Echaly - Elegant Women's Clothing",
    description: "Discover elegant and timeless women's fashion at Echaly.",
    url: "https://echaly.com",
    siteName: "Echaly",
    locale: "en_US",
    type: "website",
  },
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL || ""} />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_SUPABASE_URL || ""} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-sans overscroll-none">
        <ScrollRestoration />
        <CustomThemeProvider>
          <CartProvider>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1 pt-16 md:pt-20">{children}</main>
              <SiteFooter />
              <ScrollToTop />
            </div>
          </CartProvider>
        </CustomThemeProvider>
      </body>
    </html>
  )
}
