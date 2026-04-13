import MasonryGrid from "@/components/MasonryGrid"
import FloatingGalleryWrapper from "@/components/FloatingGalleryWrapper"

export default function PortofolioPage() {
  return (
    <>
      <FloatingGalleryWrapper />

      <div
        className="w-full h-px max-w-5xl mx-auto my-0"
      />

      <MasonryGrid />
    </>
  )
}