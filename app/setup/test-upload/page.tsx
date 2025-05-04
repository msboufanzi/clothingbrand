"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Upload } from "lucide-react"
import Image from "next/image"
import { getSupabaseClient } from "@/lib/supabase-client"

export default function TestUploadPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toISOString()}] ${message}`])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const uploadFile = async () => {
    if (!file) {
      setError("Please select a file first")
      return
    }

    setIsLoading(true)
    setError(null)
    setUploadedUrl(null)
    setLogs([])

    try {
      addLog("Starting upload process...")
      const supabase = getSupabaseClient()

      // Check if user is logged in
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) {
        addLog("No authenticated session found")
        throw new Error("You must be logged in to upload files")
      }
      addLog(`Authenticated as: ${sessionData.session.user.email}`)

      // Check if bucket exists
      addLog("Checking if bucket exists...")
      const { data: buckets } = await supabase.storage.listBuckets()
      const bucketExists = buckets?.some((bucket) => bucket.name === "product-images")

      if (!bucketExists) {
        addLog("Bucket 'product-images' does not exist")
        throw new Error("The 'product-images' bucket does not exist. Please run the storage setup first.")
      }
      addLog("Bucket 'product-images' exists")

      // Generate a unique filename
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `${fileName}`

      addLog(`Uploading file as: ${filePath}`)

      // Upload the file
      const { data, error: uploadError } = await supabase.storage.from("product-images").upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (uploadError) {
        addLog(`Upload error: ${uploadError.message}`)
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      addLog("Upload successful!")

      // Get the public URL
      const { data: publicUrlData } = supabase.storage.from("product-images").getPublicUrl(filePath)

      const publicUrl = publicUrlData.publicUrl
      addLog(`Public URL: ${publicUrl}`)

      setUploadedUrl(publicUrl)
    } catch (err) {
      console.error("Error uploading file:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Test Image Upload</CardTitle>
          <CardDescription>Test if image uploads are working correctly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 10MB)</p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
              </label>
            </div>

            {file && (
              <div className="text-sm text-gray-600">
                Selected file: <span className="font-medium">{file.name}</span> ({(file.size / 1024).toFixed(2)} KB)
              </div>
            )}

            <Button onClick={uploadFile} disabled={!file || isLoading} className="w-full">
              {isLoading ? "Uploading..." : "Upload Image"}
            </Button>

            {error && (
              <Alert className="bg-red-50" variant="outline">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {uploadedUrl && (
              <div className="space-y-2">
                <Alert className="bg-green-50" variant="outline">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>Image uploaded successfully!</AlertDescription>
                </Alert>

                <div className="relative h-40 w-full border rounded-md overflow-hidden">
                  <Image
                    src={uploadedUrl || "/placeholder.svg"}
                    alt="Uploaded image"
                    fill
                    style={{ objectFit: "contain" }}
                    unoptimized
                  />
                </div>

                <div className="text-xs text-gray-500 break-all">URL: {uploadedUrl}</div>
              </div>
            )}

            {logs.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Debug Logs:</h3>
                <div className="bg-gray-100 p-2 rounded-md text-xs font-mono h-40 overflow-y-auto">
                  {logs.map((log, index) => (
                    <div key={index} className="mb-1">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
