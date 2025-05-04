import { NextResponse } from "next/server"

// Force dynamic to prevent caching
export const dynamic = "force-dynamic"

// Static product data as fallback
const staticProducts = [
  {
    id: "static-1",
    name: "Elegant Evening Dress",
    price: 199.99,
    images: ["/images/evening-wear.jpeg"],
  },
  {
    id: "static-2",
    name: "Summer Collection Dress",
    price: 149.99,
    images: ["/images/new-collection.jpeg"],
  },
  {
    id: "static-3",
    name: "Classic Formal Dress",
    price: 179.99,
    images: ["/images/our-dresses.jpeg"],
  },
  {
    id: "static-4",
    name: "Designer Gown",
    price: 299.99,
    images: ["/gold-dress.jpeg"],
  },
]

export async function GET() {
  // Always return static products
  return NextResponse.json(staticProducts, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Cache-Control": "no-store",
    },
  })
}
