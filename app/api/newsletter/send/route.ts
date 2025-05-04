import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendEmail } from "@/lib/email"

// Initialize Supabase client with admin privileges
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: Request) {
  try {
    const { subject, content } = await request.json()

    if (!subject || !content) {
      return NextResponse.json({ error: "Subject and content are required" }, { status: 400 })
    }

    // Get all subscribers
    const { data: subscribers, error: fetchError } = await supabase.from("newsletter_subscribers").select("email")

    if (fetchError) {
      console.error("Error fetching subscribers:", fetchError)
      return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 })
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ error: "No subscribers found" }, { status: 404 })
    }

    // Send email to each subscriber
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const emails = subscribers.map((subscriber) => subscriber.email)

    // Send emails in batches to avoid rate limits
    const batchSize = 10
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize)

      for (const email of batch) {
        await sendEmail({
          to: email,
          subject,
          html: `
            ${content}
            <br><br>
            <p style="font-size: 12px; color: #666;">
              You're receiving this email because you subscribed to our newsletter.
              <a href="${siteUrl}/unsubscribe?email=${encodeURIComponent(email)}">Unsubscribe</a>
            </p>
          `,
        })
      }

      // Wait a bit between batches to avoid rate limits
      if (i + batchSize < emails.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    return NextResponse.json({ message: "Newsletter sent successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error sending newsletter:", error)
    return NextResponse.json({ error: "Failed to send newsletter" }, { status: 500 })
  }
}
