import { create } from 'zustand'

export const SESSION_KEY = 'moreartmag.iris_traversed'

type IrisStore = {
  traversed: boolean
  setTraversed: (v: boolean) => void
  hydrate: () => void
}

export const useIrisStore = create<IrisStore>((set, get) => ({
  traversed: false,
  setTraversed: (v) => {
    if (get().traversed === v) return
    set({ traversed: v })
    if (v && typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(SESSION_KEY, 'true')
      } catch {
        // sessionStorage indisponible — on garde l'état en mémoire
      }
    }
  },
  hydrate: () => {
    if (typeof window === 'undefined') return
    try {
      if (sessionStorage.getItem(SESSION_KEY) === 'true') {
        set({ traversed: true })
      }
    } catch {
      // ignore
    }
  },
}))
