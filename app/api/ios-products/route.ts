import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    // Get URL and user agent
    const { searchParams } = new URL(request.url)
    const userAgent = request.headers.get("user-agent") || ""
    const isIOS = /iPhone|iPad|iPod/.test(userAgent)

    console.log(`iOS Products API called. iOS device: ${isIOS}`)

    // Create direct Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: "Missing database credentials" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Simple query with minimal fields
    const { data, error } = await supabase.from("products").select("id, name, price, images").limit(12)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Process data for iOS compatibility
    const safeProducts = data.map((product) => ({
      id: product.id,
      name: product.name || "Product",
      price: typeof product.price === "number" ? product.price : 0,
      // Ensure images is a simple array with at least one string
      images: Array.isArray(product.images) && product.images.length > 0 ? [product.images[0]] : ["/placeholder.svg"],
    }))

    console.log(`Returning ${safeProducts.length} products for ${isIOS ? "iOS" : "other"} device`)

    // Return with iOS-friendly headers
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
    console.error("iOS products API error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
