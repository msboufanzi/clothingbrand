import { NextResponse } from "next/server"

// Ensure this runs in Node.js runtime
export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { to, subject, body } = await request.json()

    console.log("Email test request received")
    console.log("To:", to)
    console.log("Subject:", subject)

    // In v0 preview, we'll simulate success without actually sending
    if (process.env.NEXT_PUBLIC_SITE_URL?.includes("vercel.app")) {
      console.log("Preview environment detected - simulating email success")
      return NextResponse.json({
        success: true,
        simulated: true,
        message: "Email sending simulated in preview environment",
        to,
        subject,
      })
    }

    // For production, we would actually send the email
    // Import nodemailer dynamically
    const nodemailer = await import("nodemailer")

    // Create a transporter
    const transporter = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    // Send the email
    const info = await transporter.sendMail({
      from: `"Echaly Fashion" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: body,
    })

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
    })
  } catch (error) {
    console.error("Error in email test:", error)
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
