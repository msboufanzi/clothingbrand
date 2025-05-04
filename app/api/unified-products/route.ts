import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured") === "true"
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit") as string, 10) : 12

    // Create a Supabase client
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Build the query
    let query = supabase.from("products").select("id, name, price, images, category")

    // Apply filters
    if (category) {
      query = query.eq("category", category)
    }

    // Order and limit
    query = query.order("created_at", { ascending: false }).limit(limit)

    // Execute the query
    const { data, error } = await query

    if (error) {
      console.error("Error fetching products:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Process the data to ensure valid images
    const processedData = data.map((product) => {
      let validImages = []
      if (product.images && Array.isArray(product.images)) {
        validImages = product.images.filter((url) => url && typeof url === "string" && url.trim() !== "")
      }
      return {
        ...product,
        images: validImages,
      }
    })

    // Set cache headers for better performance
    return NextResponse.json(processedData, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    })
  } catch (error) {
    console.error("Unexpected error in unified products API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
