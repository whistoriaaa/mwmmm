"use client"

import dynamic from "next/dynamic"

const FloatingGallery = dynamic(
  () => import("@/components/FloatingGallery"),
  { ssr: false }
)

export default function FloatingGalleryWrapper() {
  return <FloatingGallery />
}