"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { fetchProducts, formatCurrency, type ProductData } from "@/lib/products-client"

export function ProductsGrid({ category }: { category?: string }) {
  const [products, setProducts] = useState<ProductData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadProducts() {
      try {
        setIsLoading(true)
        const data = await fetchProducts({ category, limit: 12 })

        if (isMounted) {
          setProducts(data)
          setIsLoading(false)
        }
      } catch (err) {
        console.error("Error loading products:", err)
        if (isMounted) {
          setError("Failed to load products. Please try again later.")
          setIsLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      isMounted = false
    }
  }, [category])

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-[3/4] bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
