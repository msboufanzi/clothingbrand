import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit") as string) : 20

    // Create Supabase client
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Build query
    let query = supabase.from("products").select("id, name, price, images, category")

    // Apply category filter if provided
    if (category) {
      query = query.eq("category", category)
    }

    // Execute query with limit and ordering
    const { data, error } = await query.order("created_at", { ascending: false }).limit(limit)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }

    // Process data to ensure valid images
    const processedData = data.map((product) => {
      let validImages = []
      if (product.images && Array.isArray(product.images)) {
        validImages = product.images.filter((url) => url && typeof url === "string" && url.trim() !== "")
      }

      return {
        ...product,
        images: validImages.length > 0 ? validImages : ["/placeholder.svg"],
      }
    })

    // Return JSON response with cache headers
    return NextResponse.json(processedData, {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
