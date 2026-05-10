import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

export const IrisMaterial = shaderMaterial(
  {
    uTime: 0,
    uPupilSize: 0.15,
    uIrisTex: null,
    uNoiseTex: null,
    uOpacity: 1.0,
  },
  // ── Vertex ────────────────────────────────────────────────────────────
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // ── Fragment ──────────────────────────────────────────────────────────
  `
  precision highp float;

  uniform float      uTime;
  uniform float      uPupilSize;
  uniform sampler2D  uIrisTex;
  uniform sampler2D  uNoiseTex;
  uniform float      uOpacity;
  varying vec2 vUv;

  void main() {
    vec2  uv   = vUv - 0.5;
    float dist = length(uv);
    float angle = atan(uv.y, uv.x);

    float irisR = 0.42;

    // ── Photo de l'iris ───────────────────────────────────────────────
    // La texture est une photo d'iris carrée centrée sur fond noir.
    // On la projette directement sur le disque.
    vec2 photoUv = clamp(uv / irisR * 0.5 + 0.5, 0.01, 0.99);
    vec3 irisColor = texture2D(uIrisTex, photoUv).rgb;

    // Légère animation de scintillement via la texture de bruit
    vec2 noiseUv = vec2(
      fract(dist / irisR * 2.5 - uTime * 0.025),
      fract(angle / 6.2832 + 0.5)
    );
    float noise = texture2D(uNoiseTex, noiseUv).r;
    irisColor *= 0.88 + noise * 0.12;

    // ── Anneau limbique ───────────────────────────────────────────────
    float limbal = smoothstep(0.62, 0.98, dist / irisR);
    irisColor = mix(irisColor, vec3(0.0), limbal * 0.92);

    // ── Pupille ───────────────────────────────────────────────────────
    float pupilR    = (uPupilSize / 0.5) * irisR;
    float pupilMask = 1.0 - smoothstep(pupilR - 0.012, pupilR + 0.008, dist);
    irisColor = mix(irisColor, vec3(0.01, 0.005, 0.0), pupilMask);

    // ── Reflet de lumière ─────────────────────────────────────────────
    float cl = smoothstep(0.025, 0.0, length(uv - vec2(-0.075, 0.095)));
    irisColor += cl * 0.55 * (1.0 - pupilMask);

    // ── Alpha : disque de l'iris ──────────────────────────────────────
    float alpha = (1.0 - smoothstep(irisR - 0.008, irisR + 0.016, dist)) * uOpacity;
    gl_FragColor = vec4(irisColor, alpha);
  }
  `
)
