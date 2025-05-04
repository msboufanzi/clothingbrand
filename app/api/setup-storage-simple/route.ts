import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST() {
  try {
    // Create admin client with service role key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    )

    // 1. Check if bucket exists, if not create it
    const { data: buckets } = await supabaseAdmin.storage.listBuckets()
    const bucketExists = buckets?.some((bucket) => bucket.name === "product-images")

    if (!bucketExists) {
      const { error: createError } = await supabaseAdmin.storage.createBucket("product-images", {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      })

      if (createError) {
        console.error("Error creating bucket:", createError)
        return NextResponse.json({ error: createError.message }, { status: 500 })
      }
    }

    // 2. Update bucket to be public
    const { error: updateError } = await supabaseAdmin.storage.updateBucket("product-images", {
      public: true,
    })

    if (updateError) {
      console.error("Error updating bucket:", updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message:
        "Storage bucket created and set to public successfully. Please set up RLS policies manually in the Supabase dashboard.",
      instructions: [
        "Go to the Supabase dashboard",
        "Navigate to Storage > Policies",
        "Add policies to allow authenticated users to upload, update, and delete files",
        "Add a policy to allow public access for reading files",
      ],
    })
  } catch (error) {
    console.error("Error setting up storage:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
