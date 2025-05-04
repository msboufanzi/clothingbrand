"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

type Product = {
  id: string
  name: string
  price: number
  images: string[]
}

export function IOSProducts({ category }: { category?: string }) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isIOS, setIsIOS] = useState(false)

  // Detect iOS
  useEffect(() => {
    const userAgent = navigator.userAgent
    setIsIOS(/iPhone|iPad|iPod/.test(userAgent))
  }, [])

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Build URL with cache-busting
        const url = new URL("/api/ios-products", window.location.origin)
        if (category) {
          url.searchParams.append("category", category)
        }
        // Add timestamp to prevent caching
        url.searchParams.append("_t", Date.now().toString())

        console.log("Fetching products from:", url.toString())

        // Use XMLHttpRequest for iOS instead of fetch
        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
          const xhr = new XMLHttpRequest()
          xhr.open("GET", url.toString(), true)

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const data = JSON.parse(xhr.responseText)
                if (Array.isArray(data)) {
                  setProducts(data)
                  setIsLoading(false)
                } else {
                  throw new Error("Invalid data format")
                }
              } catch (e) {
                setError("Failed to parse product data")
                setIsLoading(false)
              }
            } else {
              setError(`HTTP error: ${xhr.status}`)
              setIsLoading(false)
            }
          }

          xhr.onerror = () => {
            setError("Network error occurred")
            setIsLoading(false)
          }

          xhr.send()
        } else {
          // Use fetch for non-iOS devices
          const response = await fetch(url.toString())

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }

          const data = await response.json()

          if (!Array.isArray(data)) {
            throw new Error("Invalid data format")
          }

          setProducts(data)
          setIsLoading(false)
        }
      } catch (err) {
        console.error("Error fetching products:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [category])

  // Format price
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
        <p className="mb-4 text-sm">Device: {isIOS ? "iOS" : "Non-iOS"}</p>
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
        <p className="mb-4 text-sm">Device: {isIOS ? "iOS" : "Non-iOS"}</p>
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
