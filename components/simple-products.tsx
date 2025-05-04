"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

// Simple product type
type SimpleProduct = {
  id: string
  name: string
  price: number
  images: string[]
}

export function SimpleProducts() {
  const [products, setProducts] = useState<SimpleProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState("")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Add timestamp to prevent caching
        const url = `/api/simple-products?_t=${Date.now()}`
        setDebugInfo((prev) => prev + `Fetching from: ${url}\n`)

        console.log("Fetching products from:", url)
        const response = await fetch(url)

        setDebugInfo((prev) => prev + `Response status: ${response.status}\n`)
        console.log("Response status:", response.status)

        if (!response.ok) {
          // Try to get error details from response
          let errorDetails = ""
          try {
            const errorData = await response.json()
            errorDetails = errorData.details || errorData.error || ""
          } catch (e) {
            // If we can't parse JSON, just use status text
          }

          throw new Error(`HTTP error! Status: ${response.status}${errorDetails ? ` - ${errorDetails}` : ""}`)
        }

        const data = await response.json()
        console.log("Products received:", data.length)
        setDebugInfo((prev) => prev + `Products received: ${data.length}\n`)

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format: not an array")
        }

        setProducts(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error"
        console.error("Error fetching products:", message)
        setDebugInfo((prev) => prev + `Error: ${message}\n`)
        setError(`Failed to load products. ${message}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Format price helper
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-gray-200 mb-2"></div>
            <div className="h-4 bg-gray-200 w-3/4 mb-1"></div>
            <div className="h-4 bg-gray-200 w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  // Error state with debug info
  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <div className="mb-4 p-4 bg-gray-100 text-left text-xs overflow-auto max-h-40 rounded">
          <pre>{debugInfo}</pre>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Refresh
        </button>
      </div>
    )
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="text-center p-4">
        <p>No products available.</p>
        <div className="mb-4 p-4 bg-gray-100 text-left text-xs overflow-auto max-h-40 rounded">
          <pre>{debugInfo}</pre>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Try Again
        </button>
      </div>
    )
  }

  // Products grid
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <Link href={`/products/${product.id}`}>
              <div className="aspect-[3/4] relative mb-2">
                <Image
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
              <h3 className="text-sm font-medium">{product.name}</h3>
              <p className="text-sm text-gray-600">{formatPrice(product.price)}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
