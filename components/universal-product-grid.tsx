"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"

// Product type
type Product = {
  id: string
  name: string
  price: number
  images: string[]
  category?: string
}

export function UniversalProductGrid({ category }: { category?: string }) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deviceInfo, setDeviceInfo] = useState<string>("")

  // Detect device
  useEffect(() => {
    const userAgent = navigator.userAgent
    const isIOS = /iPhone|iPad|iPod/.test(userAgent)
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent)
    const isIOSSafari = isIOS && isSafari
    const isIOSChrome = isIOS && /CriOS/.test(userAgent)

    setDeviceInfo(
      `${isIOS ? "iOS" : "Non-iOS"} / ${isSafari ? "Safari" : "Non-Safari"} / ${isIOSChrome ? "iOS Chrome" : "Other Browser"}`,
    )
  }, [])

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // First try the API approach
        try {
          const url = new URL("/api/universal-products", window.location.origin)
          if (category) {
            url.searchParams.append("category", category)
          }
          url.searchParams.append("_t", Date.now().toString())

          console.log("Fetching from API:", url.toString())

          const response = await fetch(url.toString())

          if (response.ok) {
            const data = await response.json()
            if (Array.isArray(data) && data.length > 0) {
              console.log("API success, products:", data.length)
              setProducts(data)
              setIsLoading(false)
              return
            }
          }

          console.log("API approach failed, trying direct Supabase")
        } catch (err) {
          console.error("API error:", err)
        }

        // If API fails, try direct Supabase approach
        try {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
          const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

          if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error("Missing Supabase credentials")
          }

          console.log("Trying direct Supabase connection")

          const supabase = createClient(supabaseUrl, supabaseAnonKey)

          let query = supabase.from("products").select("id, name, price, images, category")

          if (category) {
            query = query.eq("category", category)
          }

          const { data, error: supabaseError } = await query.order("created_at", { ascending: false }).limit(12)

          if (supabaseError) {
            throw new Error(`Supabase error: ${supabaseError.message}`)
          }

          if (Array.isArray(data) && data.length > 0) {
            console.log("Supabase success, products:", data.length)
            setProducts(data)
            setIsLoading(false)
            return
          } else {
            throw new Error("No products found in database")
          }
        } catch (err) {
          console.error("Supabase error:", err)
          throw err
        }
      } catch (err) {
        console.error("All approaches failed:", err)
        setError(err instanceof Error ? err.message : "Failed to load products")
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-gray-200 mb-2 rounded"></div>
            <div className="h-4 bg-gray-200 w-3/4 mb-1 rounded"></div>
            <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
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
        <p className="mb-4 text-xs text-gray-500">Device: {deviceInfo}</p>
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
        <p className="mb-4 text-xs text-gray-500">Device: {deviceInfo}</p>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <Link href={`/products/${product.id}`}>
              <div className="aspect-[3/4] relative mb-2 bg-gray-50">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                )}
              </div>
              <h3 className="text-sm font-medium">{product.name}</h3>
              <p className="text-sm text-gray-600">{formatPrice(Number(product.price))}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
