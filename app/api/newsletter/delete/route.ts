import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client with admin privileges
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const id = formData.get("id") as string

    if (!id) {
      return NextResponse.json({ error: "Subscriber ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id)

    if (error) {
      console.error("Error deleting subscriber:", error)
      return NextResponse.json({ error: "Failed to delete subscriber" }, { status: 500 })
    }

    // Redirect back to the newsletter page
    return NextResponse.redirect(new URL("/admin/newsletter", request.url))
  } catch (error) {
    console.error("Newsletter deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Subscriber ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id)

    if (error) {
      console.error("Error deleting subscriber:", error)
      return NextResponse.json({ error: "Failed to delete subscriber" }, { status: 500 })
    }

    return NextResponse.json({ message: "Successfully deleted subscriber" }, { status: 200 })
  } catch (error) {
    console.error("Newsletter deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
