import { NextResponse } from "next/server"

// Export config to ensure this runs in the Node.js runtime, not Edge
export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { to, subject, body } = await request.json()

    console.log("Attempting to send email to:", to)

    // Check if we're in a preview environment or missing SMTP configuration
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.log("SMTP configuration missing. Email would be sent to:", to)
      console.log("Subject:", subject)
      return NextResponse.json({
        success: true,
        preview: true,
        message: "Email not sent - SMTP configuration missing",
      })
    }

    try {
      // Import nodemailer dynamically to avoid issues in preview environments
      const nodemailer = await import("nodemailer")

      // Create a test account if in development
      let testAccount = null
      if (process.env.NODE_ENV === "development" && (!process.env.SMTP_HOST || process.env.SMTP_HOST === "test")) {
        console.log("Creating test account for email...")
        testAccount = await nodemailer.createTestAccount()
        console.log("Test account created:", testAccount)
      }

      // Create a transporter with explicit configuration
      const transporter = nodemailer.default.createTransport({
        host: testAccount ? "smtp.ethereal.email" : process.env.SMTP_HOST,
        port: testAccount ? 587 : Number(process.env.SMTP_PORT || "587"),
        secure: testAccount ? false : process.env.SMTP_SECURE === "true",
        auth: {
          user: testAccount ? testAccount.user : process.env.SMTP_USER,
          pass: testAccount ? testAccount.pass : process.env.SMTP_PASSWORD,
        },
        // Disable TLS verification in development
        tls: {
          rejectUnauthorized: process.env.NODE_ENV !== "development",
        },
        // Disable DNS lookups
        ignoreTLS: process.env.NODE_ENV === "development",
      })

      // Send the email
      const info = await transporter.sendMail({
        from: testAccount ? `"Echaly Test" <${testAccount.user}>` : `"Echaly Fashion" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html: body,
      })

      console.log("Email sent successfully:", info.messageId)

      // If using ethereal email, provide the preview URL
      if (testAccount) {
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
        return NextResponse.json({
          success: true,
          messageId: info.messageId,
          previewUrl: nodemailer.getTestMessageUrl(info),
        })
      }

      return NextResponse.json({ success: true, messageId: info.messageId })
    } catch (emailError) {
      console.error("Error in email sending:", emailError)
      // Return detailed error information for debugging
      return NextResponse.json(
        {
          success: false,
          emailError: true,
          message: emailError instanceof Error ? emailError.message : "Unknown email error",
          stack: process.env.NODE_ENV === "development" && emailError instanceof Error ? emailError.stack : undefined,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in email API:", error)
    return NextResponse.json(
      {
        success: false,
        apiError: true,
        message: error instanceof Error ? error.message : "Unknown API error",
        stack: process.env.NODE_ENV === "development" && error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
