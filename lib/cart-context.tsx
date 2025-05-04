"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { ProductAttribute } from "@/components/product-attribute-selector"

export interface CartItem {
  id: string
  name: string
  price: number
  image_url?: string
  quantity: number
  selectedAttributes?: Record<string, ProductAttribute | null>
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: any) => void
  removeFromCart: (itemKey: string) => void
  updateQuantity: (itemKey: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
  isOpen?: boolean
  openCart?: () => void
  closeCart?: () => void
  toggleCart?: () => void
  continueShopping?: () => void
  totalItems?: number
  getItemKey: (item: CartItem) => string
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Calculate total items
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error)
      }
    }
    setIsInitialized(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, isInitialized])

  // Generate a unique key for a cart item based on its attributes
  // This is a SIMPLIFIED version that just uses a JSON string of attributes
  const getItemKey = (item: CartItem) => {
    // If no attributes, just use the ID
    if (!item.selectedAttributes) {
      return item.id
    }

    // Create a clean object with just the values we need
    const cleanAttributes: Record<string, string> = {}

    Object.entries(item.selectedAttributes).forEach(([key, attr]) => {
      if (attr) {
        // Use the most specific identifier available
        cleanAttributes[key] = attr.id || attr.value || attr.label || ""
      }
    })

    // If no attributes were added, just return the ID
    if (Object.keys(cleanAttributes).length === 0) {
      return item.id
    }

    // Create a consistent string representation
    return `${item.id}-${JSON.stringify(cleanAttributes)}`
  }

  const addToCart = (product: any) => {
    // Debug: Log the product being added to cart
    console.log("Adding to cart in context:", product)

    const newItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: product.quantity || 1,
      selectedAttributes: product.selectedAttributes,
    }

    // Debug: Log the new item being added to the cart
    console.log("New cart item:", newItem)
    const itemKey = getItemKey(newItem)
    console.log("Generated item key:", itemKey)

    setItems((currentItems) => {
      // Check if the item with the same attributes already exists in the cart
      const existingItemIndex = currentItems.findIndex((item) => getItemKey(item) === itemKey)

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...currentItems]
        updatedItems[existingItemIndex].quantity += newItem.quantity
        return updatedItems
      } else {
        // Add new item
        return [...currentItems, newItem]
      }
    })
    setIsOpen(true) // Open cart when adding item
  }

  const removeFromCart = (itemKey: string) => {
    console.log("Attempting to remove item with key:", itemKey)

    setItems((currentItems) => {
      // Log all current items and their keys for debugging
      currentItems.forEach((item, index) => {
        const key = getItemKey(item)
        console.log(`Item ${index}: ${item.name} has key: ${key}`)
      })

      // Find the item to remove
      const itemToRemoveIndex = currentItems.findIndex((item) => getItemKey(item) === itemKey)

      if (itemToRemoveIndex === -1) {
        console.error("Could not find item with key:", itemKey)
        return currentItems
      }

      console.log(`Found item to remove at index ${itemToRemoveIndex}:`, currentItems[itemToRemoveIndex])

      // Create a new array without the item
      const newItems = [...currentItems.slice(0, itemToRemoveIndex), ...currentItems.slice(itemToRemoveIndex + 1)]

      console.log("New cart after removal:", newItems)
      return newItems
    })
  }

  const updateQuantity = (itemKey: string, quantity: number) => {
    setItems((prevItems) => {
      return prevItems.map((item) => {
        const currentItemKey = getItemKey(item)
        if (currentItemKey === itemKey) {
          return { ...item, quantity }
        }
        return item
      })
    })
  }

  const clearCart = () => {
    setItems([])
    // Debug: Log that the cart has been cleared
    console.log("Cart cleared")
  }

  const openCart = () => {
    setIsOpen(true)
  }

  const closeCart = () => {
    setIsOpen(false)
  }

  const toggleCart = () => {
    setIsOpen((current) => !current)
  }

  // Function to handle "Continue Shopping" action
  const continueShopping = () => {
    // If cart is empty, close it
    if (items.length === 0) {
      closeCart()
    } else {
      // Otherwise just close it anyway for better UX
      closeCart()
    }
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        continueShopping,
        subtotal,
        totalItems: itemCount,
        getItemKey,
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
