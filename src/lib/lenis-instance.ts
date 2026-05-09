import type Lenis from 'lenis'

let _instance: Lenis | null = null

export function setLenisInstance(l: Lenis | null): void {
  _instance = l
}

export function getLenisInstance(): Lenis | null {
  return _instance
}
