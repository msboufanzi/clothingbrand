import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Get the form data from the request
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Create a Supabase client
    const supabase = createRouteHandlerClient({ cookies })

    // Check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Ensure the bucket exists and is public
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some((bucket) => bucket.name === "product-images")

    if (!bucketExists) {
      // Create the bucket if it doesn't exist
      const { error: createError } = await supabase.storage.createBucket("product-images", {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      })

      if (createError) {
        console.error("Error creating bucket:", createError)
        return NextResponse.json({ error: "Failed to create storage bucket" }, { status: 500 })
      }
    } else {
      // Update the bucket to be public
      const { error: updateError } = await supabase.storage.updateBucket("product-images", {
        public: true,
      })

      if (updateError) {
        console.error("Error updating bucket:", updateError)
      }
    }

    // Create a unique file name
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage.from("product-images").upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    })

    if (error) {
      console.error("Supabase storage error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage.from("product-images").getPublicUrl(data.path)

    // Return the public URL
    return NextResponse.json({
      url: publicUrlData.publicUrl,
      path: data.path,
      success: true,
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
