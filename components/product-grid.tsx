"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

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

export function ProductGrid({ category }: { category?: string }) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Reset state when category changes
    setIsLoading(true)
    setError(null)

    // Build API URL with query parameters
    const url = new URL("/api/products/list", window.location.origin)
    if (category) {
      url.searchParams.append("category", category)
    }

    // Fetch products
    fetch(url.toString())
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        setProducts(data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching products:", err)
        setError("Failed to load products. Please try again.")
        setIsLoading(false)
      })
  }, [category])

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-[3/4] bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-black text-white hover:bg-gray-800">
          Refresh
        </button>
      </div>
    )
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No products found in this category.</p>
      </div>
    )
  }

  // Products grid
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <div key={product.id} className="group">
          <Link href={`/products/${product.id}`} className="block">
            <div className="relative aspect-[3/4] mb-3 overflow-hidden bg-stone-100">
              <Image
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 25vw"
                loading="lazy"
              />
            </div>
            <div>
              <h3 className="font-light text-sm sm:text-base group-hover:underline line-clamp-1">{product.name}</h3>
              <p className="text-gray-600 text-sm">{formatCurrency(Number(product.price))}</p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}
