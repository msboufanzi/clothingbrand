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

export function ReliableProducts() {
  const [products, setProducts] = useState<SimpleProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<string>("loading")

  useEffect(() => {
    const fetchProducts = async () => {
      // Try the simple API first
      try {
        const url = `/api/simple-products?_t=${Date.now()}`
        console.log("Trying simple products API:", url)

        const response = await fetch(url)

        if (response.ok) {
          const data = await response.json()
          if (Array.isArray(data) && data.length > 0) {
            console.log("Simple API success, products:", data.length)
            setProducts(data)
            setSource("simple-api")
            setIsLoading(false)
            return
          }
        }

        console.log("Simple API failed, trying static fallback")
      } catch (err) {
        console.error("Error with simple API:", err)
      }

      // If simple API fails, try static products
      try {
        const url = `/api/static-products?_t=${Date.now()}`
        console.log("Trying static products API:", url)

        const response = await fetch(url)

        if (response.ok) {
          const data = await response.json()
          if (Array.isArray(data) && data.length > 0) {
            console.log("Static API success, products:", data.length)
            setProducts(data)
            setSource("static-fallback")
            setIsLoading(false)
            return
          }
        }

        console.log("Static API failed")
        setError("Could not load products from any source")
      } catch (err) {
        console.error("Error with static API:", err)
        setError("All product sources failed")
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

  // Error state
  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500 mb-4">{error}</p>
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
      {source === "static-fallback" && (
        <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 text-sm rounded">
          Note: Showing backup product data. Real-time products unavailable.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <Link href={source === "static-fallback" ? "#" : `/products/${product.id}`}>
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
