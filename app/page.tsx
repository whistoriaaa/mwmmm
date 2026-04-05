import FloatingGallery from "@/components/FloatingGallery"
import MasonryGrid from "@/components/MasonryGrid"

export default function PortofolioPage() {
  return (
    <>
      <FloatingGallery />

      <div
        className="w-full h-px max-w-5xl mx-auto my-0"
        style={{
          background: "linear-gradient(to right, transparent, var(--cyan), transparent)",
          opacity: 0.25
        }}
      />

      <MasonryGrid />
    </>
  )
}