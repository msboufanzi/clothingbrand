"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function FixImageUrlsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    message?: string
    error?: string
    details?: any
  } | null>(null)

  const fixImageUrls = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const supabase = createClientComponentClient()

      // Get all products
      const { data: products, error: fetchError } = await supabase.from("products").select("id, images")

      if (fetchError) throw new Error(fetchError.message)

      let updatedCount = 0
      const errors = []

      // Process each product
      for (const product of products || []) {
        if (!product.images || !Array.isArray(product.images)) continue

        // Fix image URLs
        const fixedImages = product.images
          .map((img) => {
            if (!img) return null

            // If it's already a public URL, keep it
            if (img.includes("/storage/v1/object/public/")) return img

            // If it's a temporary URL, convert to public URL
            if (img.includes("/storage/v1/object/sign/")) {
              const parts = img.split("/storage/v1/object/sign/")
              if (parts.length < 2) return img

              const pathParts = parts[1].split("?")
              if (pathParts.length < 1) return img

              return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${pathParts[0]}`
            }

            return img
          })
          .filter(Boolean)

        // Update the product with fixed image URLs
        const { error: updateError } = await supabase
          .from("products")
          .update({ images: fixedImages })
          .eq("id", product.id)

        if (updateError) {
          errors.push({ id: product.id, error: updateError.message })
        } else {
          updatedCount++
        }
      }

      setResult({
        success: true,
        message: `Fixed image URLs for ${updatedCount} products`,
        details: errors.length > 0 ? { errors } : undefined,
      })
    } catch (error) {
      console.error("Error fixing image URLs:", error)
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Fix Image URLs</CardTitle>
          <CardDescription>Convert temporary image URLs to permanent public URLs</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-gray-600">This utility will:</p>
          <ul className="list-disc pl-5 mb-4 text-sm text-gray-600 space-y-1">
            <li>Scan all products in the database</li>
            <li>Convert temporary image URLs to permanent public URLs</li>
            <li>Update the database with the fixed URLs</li>
          </ul>

          {result && (
            <Alert className={result.success ? "bg-green-50" : "bg-red-50"} variant="outline">
              {result.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>
                <p>{result.message || result.error}</p>
                {result.details && (
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={fixImageUrls} disabled={isLoading} className="w-full">
            {isLoading ? "Fixing URLs..." : "Fix Image URLs"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
