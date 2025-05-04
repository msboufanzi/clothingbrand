"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

// Define product type with simple structure
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

export function SafariProductGrid({ category }: { category?: string }) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string>("")

  useEffect(() => {
    // Reset state when category changes
    setIsLoading(true)
    setError(null)
    setDebugInfo("")

    // Build API URL with query parameters
    const url = new URL("/api/safari-compatible/products", window.location.origin)
    if (category) {
      url.searchParams.append("category", category)
    }

    // Add timestamp to prevent caching issues in Safari
    url.searchParams.append("_t", Date.now().toString())

    // Log the URL being fetched
    console.log("Fetching products from:", url.toString())
    setDebugInfo((prev) => prev + `Fetching from: ${url.toString()}\n`)

    // Fetch products with explicit error handling for Safari
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

        setProducts(data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching products:", err)
        setDebugInfo((prev) => prev + `Error: ${err.message}\n`)
        setError(`Failed to load products. Error: ${err.message}`)
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
        <p className="mb-4">No products found in this category.</p>
        <div className="mb-4 p-4 bg-gray-100 text-left text-xs overflow-auto max-h-40 rounded">
          <pre>{debugInfo}</pre>
        </div>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-black text-white hover:bg-gray-800">
          Try Again
        </button>
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
