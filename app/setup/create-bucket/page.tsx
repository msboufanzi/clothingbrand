"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function CreateBucketPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const supabase = createClientComponentClient()

  const createBucket = async () => {
    try {
      setIsLoading(true)
      setResult(null)

      // Get the user's session for authentication
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData?.session?.access_token

      if (!token) {
        setResult({
          success: false,
          message: "You must be logged in as an admin to create a bucket.",
        })
        return
      }

      // Call the server-side API to create the bucket
      const response = await fetch("/api/admin/create-bucket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bucketName: "product-images" }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create bucket")
      }

      setResult({
        success: true,
        message: data.message || "Bucket created or updated successfully",
      })
    } catch (error) {
      console.error("Error creating bucket:", error)
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Create Storage Bucket</CardTitle>
          <CardDescription>
            Create the product-images storage bucket required for uploading product images.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            This utility will create the necessary storage bucket with public access permissions. You only need to run
            this once.
          </p>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"} className="mb-4">
              {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={createBucket} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Bucket...
              </>
            ) : (
              "Create Product Images Bucket"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
