import { getServerClient } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = getServerClient()

    // Check if the email exists
    const { data: subscriber, error: fetchError } = await supabase
      .from("newsletter_subscribers")
      .select("id")
      .eq("email", email)
      .single()

    if (fetchError || !subscriber) {
      return NextResponse.json({ error: "Email not found in our subscriber list" }, { status: 404 })
    }

    // Delete the subscriber
    const { error: deleteError } = await supabase.from("newsletter_subscribers").delete().eq("id", subscriber.id)

    if (deleteError) {
      console.error("Error deleting subscriber:", deleteError)
      return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing unsubscribe request:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
