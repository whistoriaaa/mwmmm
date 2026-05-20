"use client"

import { useRef } from "react"
import { motion } from "motion/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger, SplitText)

export function SectionTitle({ label, title }: { label: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    const el = ref.current
    if (!el) return
    const heading = el.querySelector("h2")
    if (!heading) return
    const split = new SplitText(heading, { type: "chars" })
    gsap.from(split.chars, {
      opacity: 0, y: 30, rotateX: -60,
      stagger: 0.03, duration: 0.7, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
    })
    return () => split.revert()
  }, { scope: ref })
  return (
    <div ref={ref} className="mb-12 md:mb-16">
      <motion.span
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 0.7, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="block text-xs tracking-[0.45em] uppercase mb-3"
        style={{ color: "var(--cyan)" }}
      >
        {label}
      </motion.span>
      <h2
        className="font-light italic"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2rem, 4vw, 3.2rem)",
          color: "var(--gold)", lineHeight: 1.15, perspective: "400px",
        }}
      >
        {title}
      </h2>
    </div>
  )
}
