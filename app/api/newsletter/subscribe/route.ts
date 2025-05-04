import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client with admin privileges
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if email already exists
    const { data: existingSubscriber, error: checkError } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .eq("email", email)
      .maybeSingle()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking for existing subscriber:", checkError)
      return NextResponse.json({ error: "Failed to check subscription status" }, { status: 500 })
    }

    if (existingSubscriber) {
      return NextResponse.json({ message: "You're already subscribed!" }, { status: 200 })
    }

    // Add new subscriber
    const { error: insertError } = await supabase.from("newsletter_subscribers").insert([
      {
        email,
        created_at: new Date().toISOString(),
      },
    ])

    if (insertError) {
      console.error("Error adding subscriber:", insertError)
      return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
    }

    return NextResponse.json({ message: "Successfully subscribed" }, { status: 200 })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
