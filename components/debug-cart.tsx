"use client"

import { useEffect } from "react"
import { useCart } from "@/lib/cart-context"

export function DebugCart() {
  const { items } = useCart()

  useEffect(() => {
    // Send cart data to server for debugging
    const sendDebugData = async () => {
      try {
        const response = await fetch("/api/debug-cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ items }),
        })
        const data = await response.json()
        console.log("Debug response:", data)
      } catch (error) {
        console.error("Error sending debug data:", error)
      }
    }

    if (items.length > 0) {
      sendDebugData()
    }
  }, [items])

  return null // This component doesn't render anything
}
