import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

export const IrisMaterial = shaderMaterial(
  {
    uTime: 0,
    uPupilSize: 0.15,
    uColor: new THREE.Color('#c08855'),
    uNoiseTex: null,
    uOpacity: 1.0,
  },
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  `
  uniform float uTime;
  uniform float uPupilSize;
  uniform vec3 uColor;
  uniform sampler2D uNoiseTex;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv - 0.5;
    float dist = length(uv);

    float pupilMask = smoothstep(uPupilSize, uPupilSize + 0.01, dist);

    float angle = atan(uv.y, uv.x);
    vec2 noiseUv = vec2(fract(dist * 4.0 - uTime * 0.05), fract(angle / 6.28 + 0.5));
    float noise = texture2D(uNoiseTex, noiseUv).r;

    vec3 irisColor = uColor * (0.5 + noise * 0.5);

    float limbalRing = smoothstep(0.46, 0.5, dist);
    irisColor = mix(irisColor, vec3(0.0), limbalRing);

    vec3 finalColor = mix(vec3(0.0), irisColor, pupilMask);

    float outerMask = smoothstep(0.5, 0.505, dist);
    finalColor = mix(finalColor, vec3(0.0), outerMask);

    float catchlight = smoothstep(0.04, 0.0, length(uv - vec2(-0.12, 0.12)));
    finalColor += catchlight * 0.25 * pupilMask;

    gl_FragColor = vec4(finalColor, uOpacity);
  }
  `
)
