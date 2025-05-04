"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { CheckCircle, AlertCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function FixImagesPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    fixed: 0,
    skipped: 0,
  })
  const [log, setLog] = useState<string[]>([])

  const supabase = createClientComponentClient()

  const addLog = (message: string) => {
    setLog((prev) => [...prev, message])
  }

  const fixImages = async () => {
    setIsProcessing(true)
    setError(null)
    setLog([])

    try {
      addLog("Starting image fix process...")

      // First, make sure the bucket is public
      addLog("Checking bucket permissions...")

      try {
        const { data: bucketData } = await supabase.storage.getBucket("product-images")

        if (!bucketData?.public) {
          addLog("Bucket is not public. Attempting to update...")
          // Note: This might fail due to permissions, but we'll try anyway
          await supabase.storage.updateBucket("product-images", { public: true })
          addLog("Bucket updated to public.")
        } else {
          addLog("Bucket is already public.")
        }
      } catch (bucketError) {
        addLog("Could not update bucket permissions. This requires admin access.")
        addLog("Continuing with image fixes anyway...")
      }

      // Get all products
      addLog("Fetching all products...")
      const { data: products, error: productsError } = await supabase.from("products").select("id, images")

      if (productsError) {
        throw new Error(`Error fetching products: ${productsError.message}`)
      }

      if (!products || products.length === 0) {
        addLog("No products found.")
        setIsComplete(true)
        setIsProcessing(false)
        return
      }

      addLog(`Found ${products.length} products.`)
      setStats((prev) => ({ ...prev, total: products.length }))

      // Process each product
      for (const product of products) {
        addLog(`Processing product ${product.id}...`)

        if (!product.images || product.images.length === 0) {
          addLog(`Product ${product.id} has no images. Skipping.`)
          setStats((prev) => ({ ...prev, skipped: prev.skipped + 1 }))
          continue
        }

        const fixedImages = product.images.map((imageUrl: string) => {
          // If it's already a public URL, keep it
          if (imageUrl.includes("/storage/v1/object/public/")) {
            return imageUrl
          }

          // If it's a signed URL, extract the path and get a public URL
          if (imageUrl.includes("/storage/v1/object/sign/")) {
            const pathMatch = imageUrl.match(/\/storage\/v1\/object\/sign\/([^?]+)/)
            if (pathMatch && pathMatch[1]) {
              const [bucket, ...pathParts] = pathMatch[1].split("/")
              const path = pathParts.join("/")
              const { data } = supabase.storage.from(bucket).getPublicUrl(path)
              return data.publicUrl
            }
          }

          return imageUrl
        })

        // Update the product with fixed image URLs
        const { error: updateError } = await supabase
          .from("products")
          .update({ images: fixedImages })
          .eq("id", product.id)

        if (updateError) {
          addLog(`Error updating product ${product.id}: ${updateError.message}`)
          setStats((prev) => ({ ...prev, skipped: prev.skipped + 1 }))
        } else {
          addLog(`Successfully updated product ${product.id}.`)
          setStats((prev) => ({ ...prev, fixed: prev.fixed + 1 }))
        }
      }

      addLog("Image fix process complete!")
      setIsComplete(true)
    } catch (error) {
      console.error("Error fixing images:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
      addLog(`Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Fix Product Images</CardTitle>
          <CardDescription>
            This utility will fix all product images to ensure they use permanent public URLs.
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

          {isComplete && (
            <Alert className="mb-6">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Complete</AlertTitle>
              <AlertDescription>
                Process completed. Fixed {stats.fixed} of {stats.total} products.
                {stats.skipped > 0 && ` (${stats.skipped} skipped)`}
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-slate-50 p-4 rounded-md h-64 overflow-y-auto font-mono text-sm">
            {log.length === 0 ? (
              <p className="text-slate-500">Logs will appear here...</p>
            ) : (
              log.map((entry, index) => (
                <div key={index} className="mb-1">
                  <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span> {entry}
                </div>
              ))
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={fixImages} disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Fix All Images"}
          </Button>

          {isComplete && (
            <Button variant="outline" asChild>
              <Link href="/admin/products">
                Go to Products <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
