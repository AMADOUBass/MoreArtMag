'use client'

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
uniform float uTime;
uniform float uLinesCount;
uniform vec2 uMouse;
uniform vec3 uColorBase;
uniform vec3 uColorLine;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  
  // Organic flow (sine waves moving leftwards)
  float flow = sin(uv.x * 10.0 - uTime * 2.0) * 0.02;
  flow += cos(uv.x * 20.0 - uTime * 3.0) * 0.005;
  uv.y += flow;

  // Magnetic repulsion (Currents effect around the cursor)
  float dist = distance(vec2(uv.x, uv.y), uMouse);
  // Radius of the "ball"
  float radius = 0.25;
  // Gaussian bump pushing lines away from the center
  float bump = exp(-pow(dist / radius, 3.0));
  
  // Push Y direction away from mouse Y
  float pushDir = sign(uv.y - uMouse.y);
  // Apply a stronger push right in the middle
  uv.y -= pushDir * bump * 0.12; 

  // Make the lines
  float pattern = fract(uv.y * uLinesCount);
  
  float thickness = 0.08; // Thinner, sharper elegant lines
  // Anti-aliased line drawing
  float line = smoothstep(0.5 - thickness, 0.5, pattern) * smoothstep(0.5 + thickness, 0.5, pattern);

  // Add subtle glow to the lines based on distance to mouse
  float glow = smoothstep(0.4, 0.0, dist);
  vec3 coloredLine = mix(uColorLine * 0.5, uColorLine, glow + 0.5);

  // Apply color (white/gray lines on dark background)
  vec3 finalColor = mix(uColorBase, coloredLine, line);

  // Soft fade on Y edges to blend seamlessly with the page
  float fade = smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);
  finalColor = mix(uColorBase, finalColor, fade);

  gl_FragColor = vec4(finalColor, 1.0);
}
`

function WaveMesh() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { viewport } = useThree()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uLinesCount: { value: 45.0 },
      // Start mouse centered
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uColorBase: { value: new THREE.Color('#0a0a0a') },
      uColorLine: { value: new THREE.Color('#f5f5f5') },
    }),
    []
  )

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime()
      
      // Responsive lines count: fewer lines on smaller viewports for clarity
      const isSmall = state.size.width < 768
      materialRef.current.uniforms.uLinesCount.value = isSmall ? 30.0 : 45.0
      
      let targetX = (state.pointer.x + 1) / 2
      let targetY = (state.pointer.y + 1) / 2
      
      // Lerp mouse position for silky smooth movement
      materialRef.current.uniforms.uMouse.value.lerp(
        new THREE.Vector2(targetX, targetY),
        0.08
      )
    }
  })

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  )
}

export default function WaveShader() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto cursor-crosshair">
      <Canvas 
        camera={{ position: [0, 0, 1] }} 
        gl={{ alpha: true, antialias: true }}
      >
        <WaveMesh />
      </Canvas>
    </div>
  )
}
