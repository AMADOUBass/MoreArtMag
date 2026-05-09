import { ThreeElements } from '@react-three/fiber'
import { IrisMaterial } from '@/components/three/iris-shader'

declare module '@react-three/fiber' {
  interface ThreeElements {
    irisMaterial: any
  }
}

export {}
