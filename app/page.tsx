import FloatingGallery from "@/components/FloatingGallery"
import MasonryGrid from "@/components/MasonryGrid"

export default function PortofolioPage() {
  return (
    <>
      <FloatingGallery />

      <div
        className="w-full h-px max-w-5xl mx-auto my-0"
      />

      <MasonryGrid />
    </>
  )
}