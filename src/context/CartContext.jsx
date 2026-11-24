import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { loadFromStorage, saveToStorage } from '../utils/storage'

const CART_KEY = 'ecommerce_cart'
const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { product, quantity } = action
      const existing = state.find((item) => item.id === product.id)
      if (existing) {
        return state.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        )
      }
      return [...state, { ...product, quantity: Math.min(quantity, product.stock) }]
    }
    case 'REMOVE':
      return state.filter((item) => item.id !== action.id)
    case 'SET_QUANTITY':
      return state.map((item) =>
        item.id === action.id
          ? { ...item, quantity: Math.max(1, Math.min(action.quantity, item.stock)) }
          : item
      )
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, () => loadFromStorage(CART_KEY, []))

  useEffect(() => {
    saveToStorage(CART_KEY, items)
  }, [items])

  const addToCart = (product, quantity = 1) => dispatch({ type: 'ADD', product, quantity })
  const removeFromCart = (id) => dispatch({ type: 'REMOVE', id })
  const setQuantity = (id, quantity) => dispatch({ type: 'SET_QUANTITY', id, quantity })
  const clearCart = () => dispatch({ type: 'CLEAR' })

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])
  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  )

  const value = { items, addToCart, removeFromCart, setQuantity, clearCart, totalItems, totalPrice }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
