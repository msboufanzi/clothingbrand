import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Force dynamic to prevent caching
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    console.log("Simple products API called")

    // Create a direct Supabase client without auth helpers
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase credentials")
      return NextResponse.json(
        { error: "Server configuration error", details: "Missing database credentials" },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Use a simple query with minimal fields
    const { data, error } = await supabase.from("products").select("id, name, price, images").limit(10)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 })
    }

    // Process data to ensure valid images
    const safeProducts = data.map((product) => ({
      id: product.id,
      name: product.name || "Unnamed Product",
      price: typeof product.price === "number" ? product.price : 0,
      images: Array.isArray(product.images) && product.images.length > 0 ? [product.images[0]] : ["/placeholder.svg"],
    }))

    console.log(`Returning ${safeProducts.length} products`)

    // Return with CORS headers
    return NextResponse.json(safeProducts, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("Unexpected error in simple-products API:", error)
    return NextResponse.json(
      { error: "Server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
