import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // In the preview environment, we can't actually send emails
  // So we'll just return the SMTP configuration for verification

  const smtpSettings = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER,
    from: process.env.SMTP_FROM,
    adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
  }

  // Check if all required settings are present
  const missingSettings = Object.entries(smtpSettings)
    .filter(([key, value]) => !value)
    .map(([key]) => key)

  if (missingSettings.length > 0) {
    return NextResponse.json(
      {
        success: false,
        error: `Missing SMTP settings: ${missingSettings.join(", ")}`,
        smtpSettings,
      },
      { status: 400 },
    )
  }

  return NextResponse.json({
    success: true,
    message: "SMTP configuration looks valid. In a real environment, an email would be sent.",
    smtpSettings,
  })
}
