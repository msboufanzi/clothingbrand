import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with the service role key for admin access
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)

export async function POST(request: NextRequest) {
  try {
    // Check if the user is authenticated as an admin
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { bucketName = "product-images" } = await request.json()

    // Check if bucket exists
    try {
      const { data: bucketData, error: bucketError } = await supabaseAdmin.storage.getBucket(bucketName)

      if (bucketError && bucketError.message.includes("not found")) {
        // Create the bucket if it doesn't exist
        const { data, error: createError } = await supabaseAdmin.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 10485760, // 10MB
        })

        if (createError) {
          console.error("Error creating bucket:", createError)
          return NextResponse.json({ error: createError.message }, { status: 500 })
        }

        return NextResponse.json({ message: `Bucket ${bucketName} created successfully`, isNew: true })
      } else if (bucketData && !bucketData.public) {
        // Make sure the bucket is public
        const { error: updateError } = await supabaseAdmin.storage.updateBucket(bucketName, { public: true })

        if (updateError) {
          console.error("Error updating bucket:", updateError)
          return NextResponse.json({ error: updateError.message }, { status: 500 })
        }

        return NextResponse.json({ message: `Bucket ${bucketName} updated to public access`, isUpdated: true })
      }

      return NextResponse.json({ message: `Bucket ${bucketName} already exists and is public`, exists: true })
    } catch (error) {
      console.error("Error in create-bucket API route:", error)
      return NextResponse.json({ error: "Failed to create or update bucket" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in create-bucket API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
