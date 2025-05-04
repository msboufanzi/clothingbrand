"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Upload } from "lucide-react"
import Image from "next/image"

export default function AdminUploadTestPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsLoading(true)
    setError(null)
    setUploadedImage(null)

    const file = files[0]
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/admin-upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Upload failed")
      }

      setUploadedImage(data.url)
    } catch (err) {
      console.error("Error uploading:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Admin Upload Test</CardTitle>
          <CardDescription>Test uploading images using the admin client</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
              {uploadedImage ? (
                <div className="relative w-full h-48">
                  <Image
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Uploaded image"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Click to upload an image</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={isLoading} />
                </label>
              )}
            </div>

            {isLoading && (
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-2 text-sm text-gray-600">Uploading...</p>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {uploadedImage && (
              <Alert className="bg-green-50" variant="outline">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  <p>Image uploaded successfully!</p>
                  <p className="mt-1 text-xs break-all">{uploadedImage}</p>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        <CardFooter>
          {uploadedImage && (
            <Button
              onClick={() => {
                setUploadedImage(null)
                setError(null)
              }}
              className="w-full"
            >
              Upload Another Image
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
