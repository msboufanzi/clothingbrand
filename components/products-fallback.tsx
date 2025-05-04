"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"

type ProductData = {
  id: string
  name: string
  price: number
  images: string[]
  category: string
}

export function ProductsFallback({ category }: { category?: string }) {
  const [products, setProducts] = useState<ProductData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProducts() {
      try {
        // Use the API endpoint instead of direct Supabase calls
        const url = new URL("/api/products/list", window.location.origin)
        if (category) {
          url.searchParams.append("category", category)
        }

        const response = await fetch(url.toString())

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`)
        }

        const data = await response.json()

        setProducts(data || [])
        setLoading(false)
      } catch (err) {
        console.error("Error loading products:", err)
        setError("Failed to load products. Please try refreshing the page.")
        setLoading(false)
      }
    }

    loadProducts()
  }, [category])

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] mb-3 bg-stone-200 rounded"></div>
            <div className="h-4 bg-stone-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-stone-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-black text-white hover:bg-gray-800"
        >
          Refresh Page
        </button>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No products found in this category.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
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
