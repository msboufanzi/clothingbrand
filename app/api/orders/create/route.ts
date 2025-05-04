import { NextResponse } from "next/server"
import { createOrder } from "@/lib/database"
import { sendEmail, generateOrderConfirmationEmail } from "@/lib/email"

export const runtime = "nodejs" // Ensure this runs in Node.js runtime

export async function POST(request: Request) {
  try {
    const orderData = await request.json()

    // Validate required fields
    if (!orderData.customer_name || !orderData.customer_email || !orderData.items || orderData.items.length === 0) {
      return NextResponse.json({ error: "Missing required order data" }, { status: 400 })
    }

    // Prepare order items - only include fields that exist in the database
    const sanitizedItems = orderData.items.map((item: any) => {
      // Only include fields that exist in the database schema
      return {
        product_id: item.product_id,
        product_name: item.product_name,
        price: item.price,
        quantity: item.quantity,
        // Remove size, color, and attributes as they don't exist in the schema
      }
    })

    // Create order in database
    const order = await createOrder(
      {
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone || "",
        shipping_address: orderData.shipping_address,
        city: orderData.city,
        postal_code: orderData.postal_code,
        total: orderData.total,
        status: orderData.status || "pending",
        payment_method: orderData.payment_method || "cash_on_delivery",
      },
      sanitizedItems,
    )

    if (!order) {
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // Try to send email, but don't fail if it doesn't work
    try {
      // Generate email content
      const { subject, body } = generateOrderConfirmationEmail({
        id: order.id,
        customer_name: order.customer_name,
        total: order.total,
        items: order.items,
      })

      // Send email but don't await it to prevent blocking
      sendEmail({
        to: order.customer_email,
        subject,
        body,
      }).catch((emailError) => {
        console.error("Error sending confirmation email:", emailError)
        // Email errors are logged but don't affect the order process
      })
    } catch (emailError) {
      console.error("Error preparing confirmation email:", emailError)
      // Continue even if email preparation fails
    }

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 },
    )
  }
}
