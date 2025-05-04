import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    // Create Supabase client
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Build query - use the most basic query possible
    let query = supabase.from("products").select("id, name, price, images, category")

    // Apply category filter if provided
    if (category) {
      query = query.eq("category", category)
    }

    // Execute query with limit and ordering
    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }

    // Process data to ensure valid images - make it as simple as possible
    const processedData = data.map((product) => {
      // Ensure images is an array with at least one item
      let images = ["/placeholder.svg"]

      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        // Filter out any invalid images
        const validImages = product.images.filter((url) => url && typeof url === "string" && url.trim() !== "")
        if (validImages.length > 0) {
          images = validImages
        }
      }

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        images: images,
        category: product.category,
      }
    })

    // Add explicit debug information
    console.log(`API returned ${processedData.length} products`)

    // Return JSON response with CORS headers for Safari
    return NextResponse.json(processedData, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
