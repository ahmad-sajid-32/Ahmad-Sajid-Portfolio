'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import type * as THREE from 'three'

export interface DuskFieldColors {
  ringPrimary: string
  ringAccent: string
  ringHighlight: string
  prism: string
}

interface SceneProps {
  colors: DuskFieldColors
  onLowPerformance: () => void
}

/**
 * FPS watchdog (ARCHITECTURE §11.3): after a warm-up, if the average
 * frame rate over a rolling window stays below the floor, the scene
 * hands back to the static poster — a weak GPU should cost the
 * visitor nothing.
 */
function PerformanceWatchdog({ onLowPerformance }: { onLowPerformance: () => void }) {
  const state = useRef({ elapsed: 0, frames: 0, windowTime: 0, tripped: false })

  useFrame((_, delta) => {
    const s = state.current
    if (s.tripped) {
      return
    }
    s.elapsed += delta
    if (s.elapsed < 1.2) {
      return // warm-up: shader compile and first frames are not judged
    }
    s.frames += 1
    s.windowTime += delta
    // Fast exit for hopeless cases: if the first frames already
    // average under ~9 FPS, don't wait out the full window.
    if (s.frames === 12 && s.windowTime / s.frames > 0.11) {
      s.tripped = true
      onLowPerformance()
      return
    }
    if (s.frames >= 45) {
      const fps = s.frames / s.windowTime
      if (fps < 28) {
        s.tripped = true
        onLowPerformance()
      }
      s.frames = 0
      s.windowTime = 0
    }
  })

  return null
}

function Composition({ colors }: { colors: DuskFieldColors }) {
  const group = useRef<THREE.Group>(null)
  const ringA = useRef<THREE.Mesh>(null)
  const ringB = useRef<THREE.Mesh>(null)
  const ringC = useRef<THREE.Mesh>(null)
  const prism = useRef<THREE.Mesh>(null)
  const pointer = useThree((state) => state.pointer)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (group.current) {
      // Slow orbital drift + pointer parallax of a few degrees,
      // smoothed so it never feels twitchy.
      const targetY = t * 0.05 + pointer.x * 0.3
      const targetX = Math.sin(t * 0.11) * 0.06 + pointer.y * -0.18
      group.current.rotation.y += (targetY - group.current.rotation.y) * Math.min(1, delta * 2.5)
      group.current.rotation.x += (targetX - group.current.rotation.x) * Math.min(1, delta * 2.5)
    }
    if (ringA.current) {
      ringA.current.rotation.z = t * 0.07
      ringA.current.rotation.x = Math.PI / 2.4 + Math.sin(t * 0.13) * 0.08
    }
    if (ringB.current) {
      ringB.current.rotation.z = -t * 0.05
      ringB.current.rotation.y = Math.PI / 3 + Math.cos(t * 0.1) * 0.1
    }
    if (ringC.current) {
      ringC.current.rotation.z = t * 0.04
      ringC.current.rotation.x = Math.PI / 1.8 + Math.sin(t * 0.09 + 1.4) * 0.07
    }
    if (prism.current) {
      prism.current.rotation.y = t * 0.16
      prism.current.rotation.x = 0.35 + Math.sin(t * 0.2) * 0.05
      prism.current.position.y = Math.sin(t * 0.6) * 0.08
    }
  })

  return (
    <group ref={group}>
      {/* One warm key light, one cool fill — the theme's two signals. */}
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 3, 4]} intensity={60} color="#ffb36b" />
      <pointLight position={[-5, -2, 2]} intensity={18} color="#4fb3a6" />

      <mesh ref={ringA}>
        <torusGeometry args={[2.15, 0.035, 24, 128]} />
        <meshStandardMaterial
          color={colors.ringPrimary}
          transparent
          opacity={0.75}
          roughness={0.3}
          metalness={0.35}
        />
      </mesh>
      <mesh ref={ringB}>
        <torusGeometry args={[1.6, 0.03, 24, 128]} />
        <meshStandardMaterial
          color={colors.ringAccent}
          transparent
          opacity={0.65}
          roughness={0.3}
          metalness={0.35}
        />
      </mesh>
      <mesh ref={ringC}>
        <torusGeometry args={[2.7, 0.025, 24, 160]} />
        <meshStandardMaterial
          color={colors.ringHighlight}
          transparent
          opacity={0.45}
          roughness={0.35}
          metalness={0.3}
        />
      </mesh>
      <mesh ref={prism}>
        <boxGeometry args={[1.05, 1.45, 1.05]} />
        <meshPhysicalMaterial
          color={colors.prism}
          roughness={0.22}
          metalness={0.1}
          clearcoat={0.7}
          clearcoatRoughness={0.25}
          transparent
          opacity={0.92}
        />
      </mesh>
    </group>
  )
}

export default function DuskFieldScene({ colors, onLowPerformance }: SceneProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)

  // Render only while the hero is on screen — an ambient scene the
  // visitor has scrolled past should cost no GPU or battery.
  useEffect(() => {
    const el = wrapRef.current
    if (!el) {
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.02 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 7], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <PerformanceWatchdog onLowPerformance={onLowPerformance} />
        <Composition colors={colors} />
      </Canvas>
    </div>
  )
}
