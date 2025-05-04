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

    // 3. Create SQL to set up RLS policies
    // We need to use the SQL API directly since query is not a function

    // Allow authenticated users to upload
    const { error: insertPolicyError } = await supabaseAdmin
      .from("_exec_sql")
      .select("*")
      .execute(`
      CREATE POLICY IF NOT EXISTS "authenticated users can upload" 
      ON storage.objects 
      FOR INSERT 
      TO authenticated 
      WITH CHECK (bucket_id = 'product-images');
    `)

    if (insertPolicyError) {
      console.error("Error creating INSERT policy:", insertPolicyError)
    }

    // Allow authenticated users to update their own objects
    const { error: updatePolicyError } = await supabaseAdmin
      .from("_exec_sql")
      .select("*")
      .execute(`
      CREATE POLICY IF NOT EXISTS "authenticated users can update" 
      ON storage.objects 
      FOR UPDATE 
      TO authenticated 
      USING (bucket_id = 'product-images');
    `)

    if (updatePolicyError) {
      console.error("Error creating UPDATE policy:", updatePolicyError)
    }

    // Allow authenticated users to delete their own objects
    const { error: deletePolicyError } = await supabaseAdmin
      .from("_exec_sql")
      .select("*")
      .execute(`
      CREATE POLICY IF NOT EXISTS "authenticated users can delete" 
      ON storage.objects 
      FOR DELETE 
      TO authenticated 
      USING (bucket_id = 'product-images');
    `)

    if (deletePolicyError) {
      console.error("Error creating DELETE policy:", deletePolicyError)
    }

    // Allow everyone to read objects
    const { error: selectPolicyError } = await supabaseAdmin
      .from("_exec_sql")
      .select("*")
      .execute(`
      CREATE POLICY IF NOT EXISTS "everyone can read" 
      ON storage.objects 
      FOR SELECT 
      TO public 
      USING (bucket_id = 'product-images');
    `)

    if (selectPolicyError) {
      console.error("Error creating SELECT policy:", selectPolicyError)
    }

    return NextResponse.json({
      success: true,
      message: "Storage bucket configured successfully",
    })
  } catch (error) {
    console.error("Error setting up storage:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
