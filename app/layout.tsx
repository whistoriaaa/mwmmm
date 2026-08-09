import type { Metadata, Viewport } from "next"
import { Cormorant_Garamond, Plus_Jakarta_Sans, Dancing_Script } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import BottomNavBar from "@/components/BottomNavBar"
import { ThemeProvider } from "@/components/ThemeProvider"
import { ThemeToggle } from "@/components/ThemeToggle"
import InstallPWA from "@/components/InstallPWA"

const cormorant = Cormorant_Garamond({
  subsets:  ["latin"],
  weight:   ["300", "400", "600"],
  style:    ["normal", "italic"],
  variable: "--font-display",
  display:  "swap",
})

const jakarta = Plus_Jakarta_Sans({
  subsets:  ["latin"],
  weight:   ["300", "400", "500", "600", "700"],
  style:    ["normal", "italic"],
  variable: "--font-body",
  display:  "swap",
})

const dancingScript = Dancing_Script({
  subsets:  ["latin"],
  weight:   ["600"],
  variable: "--font-dancing",
  display:  "swap",
})

export const metadata: Metadata = {
  title: "Shobiryne",
  description: "Portfolio of a photographer and videographer",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Shobiryne",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
}

export const viewport: Viewport = {
  themeColor: "#080c10",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable} ${dancingScript.variable}`} suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Shobiryne" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        {/* Cegah flash saat load — baca localStorage sebelum React hydrate */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('theme')||'light';document.documentElement.setAttribute('data-theme',t);})();` }} />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <div className="fixed inset-0 -z-10" style={{ backgroundColor: "var(--background)" }} />
          <Navbar />
          {/* Toggle fixed pojok kanan atas, selalu di atas semua layer */}
          <div className="fixed top-3 right-3 z-70">
            <ThemeToggle />
          </div>
          <main>{children}</main>
          <InstallPWA />
          <div className="md:hidden">
            <BottomNavBar />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}