import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string // Concatenation of artworkId and sizeId to ensure uniqueness
  artworkId: string
  sizeId: string
  title: string
  image: string
  sizeLabel: string
  priceCents: number
  currency: string
  quantity: number
  stockRemaining: number | null
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity' | 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem) => {
        const id = `${newItem.artworkId}-${newItem.sizeId}`
        const existingItems = get().items
        const existingItem = existingItems.find((item) => item.id === id)

        if (existingItem) {
          set({
            items: existingItems.map((item) =>
              item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          })
        } else {
          set({
            items: [...existingItems, { ...newItem, id, quantity: 1 }],
          })
        }
      },

      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        })
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),

      totalPrice: () => get().items.reduce((acc, item) => acc + (item.priceCents * item.quantity), 0),
    }),
    {
      name: 'moreart-cart-storage',
    }
  )
)
