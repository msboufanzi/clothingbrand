"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function SetupStorageSimplePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    message?: string
    error?: string
    instructions?: string[]
  } | null>(null)

  const setupStorage = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/setup-storage-simple", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to set up storage")
      }

      setResult({
        success: true,
        message: data.message || "Storage configured successfully",
        instructions: data.instructions,
      })
    } catch (error) {
      console.error("Error setting up storage:", error)
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
          <CardTitle>Simple Storage Setup</CardTitle>
          <CardDescription>Create and configure the product-images bucket</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-gray-600">This utility will:</p>
          <ul className="list-disc pl-5 mb-4 text-sm text-gray-600 space-y-1">
            <li>Create the product-images bucket if it doesn't exist</li>
            <li>Make the bucket public</li>
            <li>Provide instructions for setting up RLS policies manually</li>
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

                {result.instructions && (
                  <>
                    <p className="mt-2 font-medium">Next steps:</p>
                    <ol className="list-decimal pl-5 mt-1 space-y-1 text-sm">
                      {result.instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ol>
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button onClick={setupStorage} disabled={isLoading} className="w-full">
            {isLoading ? "Setting up..." : "Configure Storage Bucket"}
          </Button>
          {result?.success && (
            <Button variant="outline" asChild className="w-full">
              <Link href="/admin/products">Go to Products</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
