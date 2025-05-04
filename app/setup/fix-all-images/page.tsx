"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function FixAllImagesPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    updated: 0,
    failed: 0,
  })
  const [log, setLog] = useState<string[]>([])

  const addLog = (message: string) => {
    setLog((prev) => [...prev, message])
  }

  const fixAllImages = async () => {
    setIsProcessing(true)
    setError(null)
    setLog([])

    try {
      const supabase = createClientComponentClient()

      // Step 1: Make sure the bucket is public
      addLog("Checking bucket permissions...")
      try {
        const { data: bucketData } = await supabase.storage.getBucket("product-images")

        if (!bucketData?.public) {
          addLog("Bucket is not public. Updating permissions...")
          await supabase.storage.updateBucket("product-images", { public: true })
          addLog("✅ Updated product-images bucket to public access")
        } else {
          addLog("✅ Bucket is already public")
        }
      } catch (bucketError) {
        addLog("⚠️ Could not verify bucket permissions. This may require admin access.")
        console.warn("Could not verify bucket permissions:", bucketError)
      }

      // Step 2: Get all products
      addLog("Fetching all products...")
      const { data: products, error: productsError } = await supabase.from("products").select("id, name, images")

      if (productsError) {
        throw new Error(`Error fetching products: ${productsError.message}`)
      }

      addLog(`Found ${products?.length || 0} products`)
      setStats((prev) => ({ ...prev, total: products?.length || 0 }))

      // Step 3: Update each product with public URLs
      let updatedCount = 0
      let failedCount = 0

      for (const product of products || []) {
        try {
          addLog(`Processing product: ${product.name} (${product.id})`)

          if (!product.images || product.images.length === 0) {
            addLog(`- No images found for this product, skipping`)
            continue
          }

          let needsUpdate = false
          const fixedImages = await Promise.all(
            product.images.map(async (imageUrl: string, index: number) => {
              // If it's already a public URL, keep it
              if (imageUrl && imageUrl.includes("/storage/v1/object/public/")) {
                addLog(`- Image ${index + 1} is already using a public URL`)
                return imageUrl
              }

              needsUpdate = true
              addLog(`- Converting image ${index + 1} to public URL`)

              // If it's a signed URL, extract the path and get a public URL
              if (imageUrl && imageUrl.includes("/storage/v1/object/sign/")) {
                try {
                  const pathMatch = imageUrl.match(/\/storage\/v1\/object\/sign\/([^?]+)/)
                  if (pathMatch && pathMatch[1]) {
                    const [bucket, ...pathParts] = pathMatch[1].split("/")
                    const path = pathParts.join("/")
                    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
                    return data.publicUrl
                  }
                } catch (e) {
                  addLog(`- ❌ Error converting image ${index + 1}: ${e}`)
                  return imageUrl
                }
              }

              return imageUrl || "/diverse-products-still-life.png"
            }),
          )

          if (needsUpdate) {
            // Update the product with fixed image URLs
            addLog(`- Updating product with fixed image URLs`)
            const { error: updateError } = await supabase
              .from("products")
              .update({ images: fixedImages })
              .eq("id", product.id)

            if (updateError) {
              addLog(`- ❌ Error updating product: ${updateError.message}`)
              failedCount++
            } else {
              addLog(`- ✅ Successfully updated product images`)
              updatedCount++
            }
          } else {
            addLog(`- ✅ All images are already using public URLs`)
          }
        } catch (productError) {
          addLog(`❌ Error processing product ${product.id}: ${productError}`)
          failedCount++
        }
      }

      setStats({
        total: products?.length || 0,
        updated: updatedCount,
        failed: failedCount,
      })

      addLog(`✅ Process complete. Updated ${updatedCount} products with public image URLs.`)
      if (failedCount > 0) {
        addLog(`⚠️ Failed to update ${failedCount} products.`)
      }
    } catch (error) {
      console.error("Error fixing all images:", error)
      setError(`${error}`)
      addLog(`❌ Error: ${error}`)
    } finally {
      setIsProcessing(false)
      setIsComplete(true)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Fix All Product Images</CardTitle>
          <CardDescription>
            This utility will convert all temporary image URLs to permanent public URLs for all products in your
            database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isComplete && !error && (
            <Alert className="mb-6">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Process Complete</AlertTitle>
              <AlertDescription>
                Processed {stats.total} products. Updated {stats.updated} products with public image URLs.
                {stats.failed > 0 && ` Failed to update ${stats.failed} products.`}
              </AlertDescription>
            </Alert>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">What this utility does:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Makes your product-images storage bucket public (if it's not already)</li>
              <li>Finds all products in your database</li>
              <li>Converts any temporary signed URLs to permanent public URLs</li>
              <li>Updates your product records with the permanent URLs</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-md max-h-80 overflow-y-auto">
            <h4 className="font-medium mb-2">Process Log:</h4>
            {log.length === 0 ? (
              <p className="text-gray-500 italic">Click "Fix All Images" to start the process.</p>
            ) : (
              <pre className="text-xs whitespace-pre-wrap">{log.join("\n")}</pre>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={fixAllImages} disabled={isProcessing} className="flex items-center gap-2">
            {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
            {isProcessing ? "Processing..." : "Fix All Images"}
          </Button>

          {isComplete && (
            <Button variant="outline" asChild>
              <Link href="/admin/products">Go to Products</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
