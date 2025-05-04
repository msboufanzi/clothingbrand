type EmailOptions = {
  to: string
  subject: string
  body: string
}

export async function sendEmail({ to, subject, body }: EmailOptions) {
  try {
    // In preview environments or environments without full Node.js support, log but don't attempt to send
    if (
      typeof window !== "undefined" ||
      process.env.NODE_ENV === "development" ||
      process.env.VERCEL_ENV === "preview" ||
      !process.env.SMTP_HOST // If SMTP settings aren't configured
    ) {
      console.log("Preview or development environment detected. Email would be sent to:", to)
      console.log("Subject:", subject)
      console.log("Body:", body.substring(0, 100) + "...")
      return { success: true, preview: true }
    }

    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, subject, body }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Email API error:", errorData)
      throw new Error(`Failed to send email: ${errorData.error || response.statusText}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("Error sending email:", error)
    // Return success anyway to not block the checkout process
    return { success: true, error: true, message: error instanceof Error ? error.message : "Unknown error" }
  }
}

export function generateOrderConfirmationEmail(order: {
  id: string
  customer_name: string
  total: number
  items: { product_name: string; price: number; quantity: number }[]
}) {
  const subject = `Echaly - Order Confirmation #${order.id}`

  const itemsList = order.items
    .map(
      (item) =>
        `<tr>
    <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product_name}</td>
    <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toLocaleString("fr-MA")} د.م.</td>
  </tr>`,
    )
    .join("")

  const body = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h1 style="text-align: center; color: #333;">Thank You for Your Order!</h1>
    <p>Hello ${order.customer_name},</p>
    <p>We're pleased to confirm your order has been received and is being processed.</p>
    
    <div style="background-color: #f8f8f8; padding: 15px; margin: 20px 0;">
      <h2 style="margin-top: 0;">Order Summary</h2>
      <p><strong>Order Number:</strong> #${order.id}</p>
      
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #eee;">
            <th style="padding: 10px; text-align: left;">Product</th>
            <th style="padding: 10px; text-align: left;">Quantity</th>
            <th style="padding: 10px; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsList}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
            <td style="padding: 10px; text-align: right;"><strong>${order.total.toLocaleString("fr-MA")} د.م.</strong></td>
          </tr>
        </tfoot>
      </table>
    </div>
    
    <p>We'll contact you shortly to confirm delivery details. If you have any questions, please don't hesitate to contact us.</p>
    
    <p>Thank you for shopping with Echaly!</p>
    
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #777; font-size: 12px;">
      <p>Echaly Fashion | 123 Fashion Avenue, Marrakech, Morocco | info@echaly.com</p>
    </div>
  </div>
`

  return { subject, body }
}

export function generateWelcomeEmail(name: string) {
  const subject = "Welcome to Echaly!"

  const body = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h1 style="text-align: center; color: #333;">Welcome to Echaly!</h1>
    <p>Hello ${name},</p>
    <p>Thank you for creating an account with Echaly. We're excited to have you join our community of fashion enthusiasts.</p>
    
    <p>With your new account, you can:</p>
    <ul>
      <li>Track your orders</li>
      <li>Save your favorite items</li>
      <li>Enjoy a faster checkout experience</li>
    </ul>
    
    <p>If you have any questions or need assistance, our customer service team is always ready to help.</p>
    
    <p>Happy shopping!</p>
    
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #777; font-size: 12px;">
      <p>Echaly Fashion | 123 Fashion Avenue, Marrakech, Morocco | info@echaly.com</p>
    </div>
  </div>
`

  return { subject, body }
}

export function generatePasswordResetEmail(name: string, resetLink: string) {
  const subject = "Reset Your Echaly Password"

  const body = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h1 style="text-align: center; color: #333;">Reset Your Password</h1>
    <p>Hello ${name},</p>
    <p>We received a request to reset your password for your Echaly account. If you didn't make this request, you can safely ignore this email.</p>
    
    <p style="text-align: center; margin: 30px 0;">
      <a href="${resetLink}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Reset Password</a>
    </p>
    
    <p>This link will expire in 24 hours. If you need assistance, please contact our customer support team.</p>
    
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #777; font-size: 12px;">
      <p>Echaly Fashion | 123 Fashion Avenue, Marrakech, Morocco | info@echaly.com</p>
    </div>
  </div>
`

  return { subject, body }
}

export function generateAdminNotificationEmail(event: string, details: Record<string, any>) {
  let subject = ""
  let body = ""

  switch (event) {
    case "new_order":
      subject = `New Order #${details.orderId} Received`
      body = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">New Order Received</h1>
          <p>A new order has been placed on your store.</p>
          
          <div style="background-color: #f8f8f8; padding: 15px; margin: 20px 0;">
            <p><strong>Order ID:</strong> #${details.orderId}</p>
            <p><strong>Customer:</strong> ${details.customerName}</p>
            <p><strong>Total Amount:</strong> ${details.total.toLocaleString("fr-MA")} د.م.</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p>Please log in to your admin dashboard to view the complete order details.</p>
        </div>
      `
      break

    case "new_customer":
      subject = "New Customer Registration"
      body = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">New Customer Registration</h1>
          <p>A new customer has registered on your store.</p>
          
          <div style="background-color: #f8f8f8; padding: 15px; margin: 20px 0;">
            <p><strong>Name:</strong> ${details.name}</p>
            <p><strong>Email:</strong> ${details.email}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `
      break

    case "low_stock":
      subject = "Low Stock Alert"
      body = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Low Stock Alert</h1>
          <p>The following product is running low on stock:</p>
          
          <div style="background-color: #f8f8f8; padding: 15px; margin: 20px 0;">
            <p><strong>Product:</strong> ${details.productName}</p>
            <p><strong>Current Stock:</strong> ${details.currentStock}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p>Please log in to your admin dashboard to update the inventory.</p>
        </div>
      `
      break

    default:
      subject = "Echaly Store Notification"
      body = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Store Notification</h1>
          <p>There has been an update in your store:</p>
          
          <div style="background-color: #f8f8f8; padding: 15px; margin: 20px 0;">
            <p><strong>Event:</strong> ${event}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <pre>${JSON.stringify(details, null, 2)}</pre>
          </div>
        </div>
      `
  }

  return { subject, body }
}
