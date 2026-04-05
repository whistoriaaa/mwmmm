"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function ParticleField3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // ── Renderer ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.z = 4

    // ── Particles ─────────────────────────────────────────────
    const COUNT = 1200
    const positions = new Float32Array(COUNT * 3)
    const colors    = new Float32Array(COUNT * 3)
    const sizes     = new Float32Array(COUNT)

    const palette = [
      new THREE.Color("#22b3d0"), // cyan
      new THREE.Color("#d3b366"), // gold
      new THREE.Color("#cf539b"), // pink
      new THREE.Color("#f0ece4"), // white — paling banyak
      new THREE.Color("#f0ece4"),
      new THREE.Color("#f0ece4"),
    ]

    for (let i = 0; i < COUNT; i++) {
      // Distribusi bola (sphere random)
      const r     = 4 + Math.random() * 4
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      const c = palette[Math.floor(Math.random() * palette.length)]
      colors[i * 3]     = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b

      sizes[i] = Math.random() * 2 + 0.5
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute("color",    new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute("size",     new THREE.BufferAttribute(sizes, 1))

    // ── Bokeh circle texture ──────────────────────────────────
    const tex = (() => {
      const size = 64
      const c    = document.createElement("canvas")
      c.width = c.height = size
      const ctx = c.getContext("2d")!
      const grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2)
      grad.addColorStop(0,    "rgba(255,255,255,1)")
      grad.addColorStop(0.4,  "rgba(255,255,255,0.6)")
      grad.addColorStop(1,    "rgba(255,255,255,0)")
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, size, size)
      return new THREE.CanvasTexture(c)
    })()

    const material = new THREE.PointsMaterial({
      size:          0.06,
      map:           tex,
      vertexColors:  true,
      transparent:   true,
      opacity:       0.75,
      sizeAttenuation: true,
      depthWrite:    false,
      blending:      THREE.AdditiveBlending,
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // ── Mouse parallax ────────────────────────────────────────
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    const onMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth  - 0.5) * 0.6
      targetY = (e.clientY / window.innerHeight - 0.5) * 0.4
    }
    window.addEventListener("mousemove", onMouseMove)

    // ── Resize ────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", onResize)

    // ── Animate ───────────────────────────────────────────────
    let animId: number
    const startTime = performance.now()

const animate = () => {
  animId = requestAnimationFrame(animate)
  const t = (performance.now() - startTime) / 1000  // detik

  currentX += (targetX - currentX) * 0.04
  currentY += (targetY - currentY) * 0.04

  particles.rotation.y = t * 0.025 + currentX
  particles.rotation.x = t * 0.015 + currentY

  const breath = 1 + Math.sin(t * 0.4) * 0.015
  particles.scale.setScalar(breath)

  renderer.render(scene, camera)
}
animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("resize", onResize)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      tex.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none", zIndex: 0, opacity: 0.55 }}
    />
  )
}