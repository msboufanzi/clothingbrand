import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { data, error } = await supabase
      .from("products")
      .select("id, name, price, images")
      .order("created_at", { ascending: false })
      .limit(4)

    if (error) {
      throw error
    }

    // Process images to ensure they're valid
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

    return NextResponse.json(processedData, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return NextResponse.json({ error: "Failed to fetch featured products" }, { status: 500 })
  }
}
