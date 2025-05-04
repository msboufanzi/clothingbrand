"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { ProductAttributeSelector } from "@/components/product-attribute-selector"
import { getProductById, type Product } from "@/lib/database"

export default function ProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")

  useEffect(() => {
    async function fetchProduct() {
      try {
        setIsLoading(true)
        setError(null)

        if (!params.id) {
          throw new Error("Product ID is required")
        }

        const productData = await getProductById(params.id as string)

        if (!productData) {
          throw new Error("Product not found")
        }

        setProduct(productData)

        // Set default selections if available
        if (productData.defaultSize) {
          setSelectedSize(productData.defaultSize)
        } else if (productData.sizes && productData.sizes.length > 0) {
          // Find first in-stock size
          const firstInStockSize = productData.sizes.find((size) => size.inStock)
          if (firstInStockSize) {
            setSelectedSize(firstInStockSize.value)
          }
        }

        if (productData.defaultColor) {
          setSelectedColor(productData.defaultColor)
        } else if (productData.colors && productData.colors.length > 0) {
          // Find first in-stock color
          const firstInStockColor = productData.colors.find((color) => color.inStock)
          if (firstInStockColor) {
            setSelectedColor(firstInStockColor.value)
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        setError(error instanceof Error ? error.message : "Failed to load product")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  const nextImage = () => {
    if (!product || !product.images) return
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    if (!product || !product.images) return
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  // Check if the selected variant is in stock
  const isVariantInStock = () => {
    if (!product) return false

    // If product has both sizes and colors, check stock per variant
    if (product.sizes?.length && product.colors?.length) {
      const variantKey = `${selectedSize}-${selectedColor}`
      return (product.stockPerVariant?.[variantKey] || 0) > 0
    }

    // If product has only sizes
    if (product.sizes?.length && selectedSize) {
      const size = product.sizes.find((s) => s.value === selectedSize)
      return size?.inStock || false
    }

    // If product has only colors
    if (product.colors?.length && selectedColor) {
      const color = product.colors.find((c) => c.value === selectedColor)
      return color?.inStock || false
    }

    // Default to general stock
    return (product.stock || 0) > 0
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <Skeleton className="aspect-square w-full rounded-md" />
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error</p>
          <p>{error || "Failed to load product"}</p>
          <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="flex flex-col md:flex-row gap-4 sm:gap-8">
        {/* Product Images - optimize for mobile */}
        <div className="w-full md:w-1/2">
          <div className="relative aspect-square rounded-md overflow-hidden">
            <Image
              src={product.images[currentImageIndex] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="eager"
            />

            {product.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90"
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90"
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>

          {/* Thumbnail Navigation - optimize for mobile */}
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-2 sm:mt-4 overflow-x-auto pb-2 snap-x scrollbar-hide">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden flex-shrink-0 snap-start ${
                    index === currentImageIndex ? "ring-2 ring-black" : "opacity-70"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                  aria-label={`View image ${index + 1}`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details - optimize for mobile */}
        <div className="w-full md:w-1/2 space-y-4 sm:space-y-6 mt-4 md:mt-0">
          <div>
            <h1 className="text-xl sm:text-3xl font-light">{product.name}</h1>
            <p className="text-lg sm:text-2xl font-medium mt-1 sm:mt-2">{product.price.toLocaleString("fr-MA")} د.م.</p>
          </div>

          <div className="prose prose-stone max-w-none text-sm sm:text-base">
            <p>{product.description}</p>
          </div>

          {/* Product Attributes with improved touch targets */}
          {product.sizes && product.sizes.length > 0 && (
            <ProductAttributeSelector
              label="Size"
              options={product.sizes.map((size) => ({
                value: size.value,
                label: size.label,
                disabled: !size.inStock,
              }))}
              selected={selectedSize}
              onSelect={setSelectedSize}
            />
          )}

          {product.colors && product.colors.length > 0 && (
            <ProductAttributeSelector
              label="Color"
              options={product.colors.map((color) => ({
                value: color.value,
                label: color.label,
                disabled: !color.inStock,
                color: color.colorCode,
              }))}
              selected={selectedColor}
              onSelect={setSelectedColor}
            />
          )}

          {/* Add to Cart with larger touch target */}
          <div className="py-2">
            <AddToCartButton
              product={{
                ...product,
                selectedSize,
                selectedColor,
              }}
              disabled={!isVariantInStock()}
            />
          </div>

          {/* Product Details */}
          {product.details && product.details.length > 0 && (
            <div className="border-t pt-4 sm:pt-6 mt-6 sm:mt-8">
              <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">Product Details</h3>
              <ul className="list-disc pl-5 space-y-1 sm:space-y-2 text-sm sm:text-base">
                {product.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
