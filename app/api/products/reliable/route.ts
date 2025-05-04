import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "12", 10)

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Calculate pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    // Build query
    let query = supabase.from("products").select("id, name, price, images, category", { count: "exact" })

    if (category) {
      query = query.eq("category", category)
    }

    // Execute query with pagination
    const { data, error, count } = await query.order("created_at", { ascending: false }).range(from, to)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    // Process products to ensure valid images
    const products = data.map((product) => ({
      ...product,
      images: Array.isArray(product.images)
        ? product.images.filter((url) => url && typeof url === "string" && url.trim() !== "")
        : [],
      price: Number(product.price),
    }))

    return NextResponse.json(
      {
        products,
        pagination: {
          page,
          pageSize,
          totalItems: count || 0,
          totalPages: count ? Math.ceil(count / pageSize) : 0,
        },
      },
      {
        headers: {
          // Short cache with revalidation for performance
          "Cache-Control": "public, max-age=10, stale-while-revalidate=60",
        },
      },
    )
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
