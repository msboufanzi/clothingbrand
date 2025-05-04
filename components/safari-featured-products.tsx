"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"

// Define product type
type Product = {
  id: string
  name: string
  price: number
  images: string[]
  category: string
}

// Format currency helper
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function SafariFeaturedProducts() {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string>("")

  useEffect(() => {
    // Build API URL with limit parameter
    const url = new URL("/api/safari-compatible/products", window.location.origin)
    url.searchParams.append("limit", "4")

    // Add timestamp to prevent caching issues in Safari
    url.searchParams.append("_t", Date.now().toString())

    // Log the URL being fetched
    console.log("Fetching featured products from:", url.toString())
    setDebugInfo((prev) => prev + `Fetching from: ${url.toString()}\n`)

    // Fetch featured products
    fetch(url.toString())
      .then((response) => {
        // Log response status
        console.log("Response status:", response.status)
        setDebugInfo((prev) => prev + `Response status: ${response.status}\n`)

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        // Log data received
        console.log("Products received:", data.length)
        setDebugInfo((prev) => prev + `Products received: ${data.length}\n`)

        if (!Array.isArray(data)) {
          console.error("Data is not an array:", data)
          setDebugInfo((prev) => prev + `Error: Data is not an array\n`)
          throw new Error("Invalid data format")
        }

        // Take only the first 4 products
        setProducts(data.slice(0, 4))
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching featured products:", err)
        setDebugInfo((prev) => prev + `Error: ${err.message}\n`)
        setError(`Failed to load featured products. Error: ${err.message}`)
        setIsLoading(false)
      })
  }, [])

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()

    const imageUrl = product.images && product.images.length > 0 ? product.images[0] : null

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: imageUrl,
      selectedAttributes: {},
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] mb-3 bg-stone-200 rounded"></div>
            <div className="h-4 bg-stone-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-stone-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  // Error state with debug info
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <div className="mb-4 p-4 bg-gray-100 text-left text-xs overflow-auto max-h-40 rounded">
          <pre>{debugInfo}</pre>
        </div>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-black text-white hover:bg-gray-800">
          Refresh
        </button>
      </div>
    )
  }

  // Empty state with debug info
  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="mb-4">No featured products available.</p>
        <div className="mb-4 p-4 bg-gray-100 text-left text-xs overflow-auto max-h-40 rounded">
          <pre>{debugInfo}</pre>
        </div>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-black text-white hover:bg-gray-800">
          Try Again
        </button>
      </div>
    )
  }

  // Featured products grid
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
      {products.map((product) => (
        <div key={product.id} className="group">
          <div
            className="relative aspect-[3/4] mb-3 overflow-hidden bg-stone-100"
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
            onTouchStart={() => setHoveredProduct(product.id)}
            onTouchEnd={() => setTimeout(() => setHoveredProduct(null), 1000)}
          >
            <Link href={`/products/${product.id}`} className="block w-full h-full">
              <Image
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 25vw"
                loading="lazy"
              />
            </Link>
            <div
              className={`absolute inset-0 bg-black/0 transition-all duration-300 flex items-center justify-center ${hoveredProduct === product.id ? "bg-black/10" : ""}`}
            >
              <Button
                onClick={(e) => handleQuickAdd(e, product)}
                className={`bg-white text-black hover:bg-white/90 transition-all duration-300 ${
                  hoveredProduct === product.id ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Quick Add
              </Button>
            </div>
          </div>
          <div>
            <h3 className="font-light text-sm sm:text-base line-clamp-1">
              <Link href={`/products/${product.id}`} className="hover:underline">
                {product.name}
              </Link>
            </h3>
            <p className="text-gray-600 text-sm">{formatCurrency(Number(product.price))}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
