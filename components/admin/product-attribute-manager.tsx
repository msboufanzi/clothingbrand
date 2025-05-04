"use client"
import type { ProductAttribute } from "@/components/product-attribute-selector"

interface ProductAttributeManagerProps {
  type: string
  attributes: ProductAttribute[]
  onChange: (attributes: ProductAttribute[]) => void
  showColorPicker?: boolean
}
