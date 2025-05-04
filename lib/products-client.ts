// This file contains client-safe product fetching utilities
// NO SERVER-ONLY IMPORTS OR MIDDLEWARE REFERENCES

// Type definitions
export type ProductData = {
  id: string
  name: string
  price: number
  images: string[]
  category: string
}

/**
 * Fetches products from the unified API
 * Works on both client and server
 */
export async function fetchProducts(options: {
  category?: string
  featured?: boolean
  limit?: number
}): Promise<ProductData[]> {
  try {
    const { category, featured, limit = 12 } = options

    // Build the URL with query parameters
    const url = new URL("/api/unified-products", window.location.origin)
    if (category) url.searchParams.append("category", category)
    if (featured) url.searchParams.append("featured", "true")
    if (limit) url.searchParams.append("limit", limit.toString())

    // Fetch the data
    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

/**
 * Formats currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}
