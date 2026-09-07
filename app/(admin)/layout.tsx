import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"
import "./admin.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: { default: "CMS — Shobiryne", template: "%s — CMS" },
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // CMS boleh di-zoom (beda dari situs publik)
}

export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={geist.variable} suppressHydrationWarning>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
