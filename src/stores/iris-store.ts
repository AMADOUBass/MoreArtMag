import { create } from 'zustand'

export const SESSION_KEY = 'moreartmag.iris_traversed'

type IrisStore = {
  traversed: boolean
  irisActive: boolean
  setTraversed: (v: boolean) => void
  setIrisActive: (v: boolean) => void
  hydrate: () => void
}

export const useIrisStore = create<IrisStore>((set, get) => ({
  traversed: false,
  irisActive: true,
  setTraversed: (v) => {
    if (get().traversed === v) return
    set({ traversed: v })
    if (v && typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(SESSION_KEY, 'true')
      } catch {
        // sessionStorage indisponible
      }
    }
  },
  setIrisActive: (v) => set({ irisActive: v }),
  hydrate: () => {
    if (typeof window === 'undefined') return
    try {
      if (sessionStorage.getItem(SESSION_KEY) === 'true') {
        set({ traversed: true, irisActive: false })
      }
    } catch {
      // ignore
    }
  },
}))
