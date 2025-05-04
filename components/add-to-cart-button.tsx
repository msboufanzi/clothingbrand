"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import type { ProductAttribute } from "@/components/product-attribute-selector"

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    price: number
    image_url?: string
  }
  selectedAttributes?: Record<string, ProductAttribute | null>
  className?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  showIcon?: boolean
  quantity?: number
}

export function AddToCartButton({
  product,
  selectedAttributes,
  className,
  variant = "default",
  size = "default",
  showIcon = true,
  quantity = 1,
}: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)

    // Log what we're adding to cart
    console.log("AddToCartButton - Adding to cart:", {
      ...product,
      selectedAttributes,
      quantity,
    })

    // Add to cart with selected attributes
    addToCart({
      ...product,
      selectedAttributes,
      quantity,
    })

    // Reset adding state after a short delay
    setTimeout(() => {
      setIsAdding(false)
    }, 500)
  }

  return (
    <Button onClick={handleAddToCart} className={className} variant={variant} size={size} disabled={isAdding}>
      {showIcon && <ShoppingCart className="mr-2 h-4 w-4" />}
      {isAdding ? "Adding..." : "Add to Cart"}
    </Button>
  )
}
