"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import type { Product } from "@/data/products"

interface CartItem extends Product {
  quantity: number
  selectedColor?: string
}

interface CartState {
  items: CartItem[]
  isLoading: boolean
}

interface CartContextType extends CartState {
  addItem: (product: Product, options?: { selectedColor?: string; selectedImage?: string; quantity?: number }) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  isCartOpen: boolean
  setCartOpen: (isOpen: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

type CartAction =
  | { type: "ADD_ITEM"; payload: Product & { selectedColor?: string; image?: string; quantity?: number } }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_CART_OPEN"; payload: boolean }

function cartReducer(state: CartState & { isCartOpen: boolean }, action: CartAction): CartState & { isCartOpen: boolean } {
  switch (action.type) {
    case "SET_CART_OPEN":
      return {
        ...state,
        isCartOpen: action.payload,
      }
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }
    case "LOAD_CART":
      return {
        ...state,
        items: action.payload,
        isLoading: false,
      }

    case "ADD_ITEM": {
      const quantityToAdd = action.payload.quantity || 1
      const existingItem = state.items.find((item) => item.id === action.payload.id && item.selectedColor === action.payload.selectedColor)

      if (existingItem) {
        const newState = {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id && item.selectedColor === action.payload.selectedColor 
              ? { ...item, quantity: item.quantity + quantityToAdd } 
              : item,
          ),
        }
        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("cart", JSON.stringify(newState.items))
        }
        return newState
      }

      const newState = {
        ...state,
        items: [...state.items, { ...action.payload, quantity: quantityToAdd, selectedColor: action.payload.selectedColor }],
      }
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(newState.items))
      }
      return newState
    }

    case "REMOVE_ITEM": {
      const newState = {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(newState.items))
      }
      return newState
    }

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        const newState = {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.id),
        }
        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("cart", JSON.stringify(newState.items))
        }
        return newState
      }

      const newState = {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
        ),
      }
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(newState.items))
      }
      return newState
    }

    case "CLEAR_CART": {
      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("cart")
      }
      return { ...state, items: [] }
    }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isLoading: true, isCartOpen: false })

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart)
          dispatch({ type: "LOAD_CART", payload: parsedCart })
        } catch (error) {
          console.error("Error loading cart from localStorage:", error)
          dispatch({ type: "SET_LOADING", payload: false })
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }
  }, [])

  const addItem = (product: Product, options?: { selectedColor?: string; selectedImage?: string; quantity?: number }) => {
    const payload = { ...product } as Product & { selectedColor?: string; image?: string; quantity?: number }
    if (options?.selectedColor) {
      (payload as any).selectedColor = options.selectedColor
    }
    if (options?.selectedImage) {
      payload.image = options.selectedImage
    }
    if (options?.quantity) {
      payload.quantity = options.quantity
    }
    dispatch({ type: "ADD_ITEM", payload })
    dispatch({ type: "SET_CART_OPEN", payload: true })
  }

  const removeItem = (productId: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId })
  }

  const updateQuantity = (productId: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id: productId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const setCartOpen = (isOpen: boolean) => {
    dispatch({ type: "SET_CART_OPEN", payload: isOpen })
  }

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
