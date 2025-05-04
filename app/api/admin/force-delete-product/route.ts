import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with admin privileges
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
)

export async function POST(request: Request) {
  try {
    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    console.log(`Force deleting product with ID: ${productId}`)

    // Check if the product exists
    const { data: product, error: checkError } = await supabaseAdmin
      .from("products")
      .select("id, name")
      .eq("id", productId)
      .single()

    if (checkError) {
      console.error(`Error checking product ${productId}:`, checkError)
      return NextResponse.json({ error: `Error checking product: ${checkError.message}` }, { status: 500 })
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check for related records in order_items
    const { data: orderItems, error: orderItemsError } = await supabaseAdmin
      .from("order_items")
      .select("id")
      .eq("product_id", productId)

    if (orderItemsError) {
      console.error(`Error checking order items for product ${productId}:`, orderItemsError)
      return NextResponse.json({ error: `Error checking order items: ${orderItemsError.message}` }, { status: 500 })
    }

    // If there are order items, delete them first
    if (orderItems && orderItems.length > 0) {
      console.log(`Found ${orderItems.length} order items for product ${productId}, deleting them first`)

      const { error: deleteItemsError } = await supabaseAdmin.from("order_items").delete().eq("product_id", productId)

      if (deleteItemsError) {
        console.error(`Error deleting order items for product ${productId}:`, deleteItemsError)
        return NextResponse.json({ error: `Error deleting order items: ${deleteItemsError.message}` }, { status: 500 })
      }
    }

    // Now delete the product
    const { error: deleteError } = await supabaseAdmin.from("products").delete().eq("id", productId)

    if (deleteError) {
      console.error(`Error deleting product ${productId}:`, deleteError)
      return NextResponse.json({ error: `Error deleting product: ${deleteError.message}` }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: `Product ${product.name} deleted successfully` })
  } catch (error) {
    console.error("Unexpected error in force-delete-product:", error)
    return NextResponse.json(
      { error: `Unexpected error: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}
