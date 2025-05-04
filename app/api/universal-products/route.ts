import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    // Get URL and user agent
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const userAgent = request.headers.get("user-agent") || ""
    const isIOS = /iPhone|iPad|iPod/.test(userAgent)

    console.log(`Universal Products API called. Category: ${category || "none"}, iOS: ${isIOS}`)

    // Create Supabase client
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

    // Build query
    let query = supabase.from("products").select("id, name, price, images, category")

    if (category) {
      query = query.eq("category", category)
    }

    // Execute query
    const { data, error } = await query.order("created_at", { ascending: false }).limit(12)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 })
    }

    // Process data for cross-platform compatibility
    const safeProducts = data.map((product) => ({
      id: product.id,
      name: product.name || "Product",
      price: typeof product.price === "number" ? product.price : 0,
      // Ensure images is a simple array with at least one string
      images: Array.isArray(product.images) && product.images.length > 0 ? [product.images[0]] : ["/placeholder.svg"],
      category: product.category,
    }))

    console.log(`Returning ${safeProducts.length} products`)

    // Return with cross-platform headers
    return NextResponse.json(safeProducts, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("Universal products API error:", error)
    return NextResponse.json(
      { error: "Server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
