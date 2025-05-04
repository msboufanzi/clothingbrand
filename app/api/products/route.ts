import { NextResponse } from "next/server"
import { getProducts, getProductsByCategory } from "@/lib/database"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined
  const exclude = searchParams.get("exclude")

  try {
    let products = category ? await getProductsByCategory(category) : await getProducts()

    // Exclude a specific product if needed
    if (exclude) {
      products = products.filter((product) => product.id !== exclude)
    }

    // Limit the number of products if specified
    if (limit && limit > 0) {
      products = products.slice(0, limit)
    }

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
