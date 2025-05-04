"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/lib/database"

interface ProductAttributesProps {
  product: Product
}

export function ProductAttributes({ product }: ProductAttributesProps) {
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")

  // Initialize with default values or first available option
  useEffect(() => {
    if (product.sizes && product.sizes.length > 0) {
      if (product.defaultSize && product.sizes.some((s) => s.value === product.defaultSize)) {
        setSelectedSize(product.defaultSize)
      } else {
        // Find first in-stock size
        const firstInStockSize = product.sizes.find((s) => s.inStock)
        if (firstInStockSize) {
          setSelectedSize(firstInStockSize.value)
        } else {
          setSelectedSize(product.sizes[0].value)
        }
      }
    }

    if (product.colors && product.colors.length > 0) {
      if (product.defaultColor && product.colors.some((c) => c.value === product.defaultColor)) {
        setSelectedColor(product.defaultColor)
      } else {
        // Find first in-stock color
        const firstInStockColor = product.colors.find((c) => c.inStock)
        if (firstInStockColor) {
          setSelectedColor(firstInStockColor.value)
        } else {
          setSelectedColor(product.colors[0].value)
        }
      }
    }
  }, [product])

  // Store selected attributes in localStorage to persist across page navigation
  useEffect(() => {
    if (selectedSize) {
      localStorage.setItem(`product_${product.id}_size`, selectedSize)
    }
    if (selectedColor) {
      localStorage.setItem(`product_${product.id}_color`, selectedColor)
    }
  }, [selectedSize, selectedColor, product.id])

  // Load saved selections from localStorage
  useEffect(() => {
    const savedSize = localStorage.getItem(`product_${product.id}_size`)
    const savedColor = localStorage.getItem(`product_${product.id}_color`)

    if (savedSize && product.sizes && product.sizes.some((s) => s.value === savedSize)) {
      setSelectedSize(savedSize)
    }

    if (savedColor && product.colors && product.colors.some((c) => c.value === savedColor)) {
      setSelectedColor(savedColor)
    }
  }, [product.id, product.sizes, product.colors])

  if (!product.sizes?.length && !product.colors?.length) {
    return null
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Size</h3>
          <div className="flex flex-wrap gap-3">
            {product.sizes.map((size) => (
              <button
                key={size.value}
                type="button"
                onClick={() => setSelectedSize(size.value)}
                disabled={!size.inStock}
                className={`
                  h-10 min-w-[2.5rem] px-3 flex items-center justify-center 
                  border transition-colors uppercase
                  ${
                    selectedSize === size.value
                      ? "border-black bg-black text-white"
                      : "border-gray-300 hover:border-gray-400"
                  }
                  ${!size.inStock ? "opacity-50 cursor-not-allowed line-through" : ""}
                `}
                aria-label={`Select size ${size.label}`}
                aria-pressed={selectedSize === size.value}
              >
                {size.label}
              </button>
            ))}
          </div>
          {product.sizes.some((s) => !s.inStock) && (
            <p className="text-sm text-gray-500 mt-2">Some sizes are out of stock</p>
          )}
        </div>
      )}

      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Color</h3>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setSelectedColor(color.value)}
                disabled={!color.inStock}
                className={`
                  relative h-10 w-10 rounded-full border-2 transition-all
                  ${
                    selectedColor === color.value
                      ? "ring-2 ring-black ring-offset-2"
                      : "hover:ring-1 hover:ring-gray-300 hover:ring-offset-1"
                  }
                  ${!color.inStock ? "opacity-50 cursor-not-allowed" : ""}
                `}
                style={{ backgroundColor: color.colorCode }}
                aria-label={`Select color ${color.label}`}
                aria-pressed={selectedColor === color.value}
              >
                {!color.inStock && (
                  <span className="absolute inset-0 flex items-center justify-center text-white text-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="mt-2 text-sm">
            {selectedColor && (
              <p>
                Selected:{" "}
                <span className="font-medium">{product.colors.find((c) => c.value === selectedColor)?.label}</span>
              </p>
            )}
            {product.colors.some((c) => !c.inStock) && <p className="text-gray-500">Some colors are out of stock</p>}
          </div>
        </div>
      )}
    </div>
  )
}
