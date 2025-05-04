"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Copy } from "lucide-react"

export default function StoragePoliciesPage() {
  const [copied, setCopied] = useState(false)

  const sqlScript = `
-- First, remove any existing policies
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- Create a policy to allow public read access to the product-images bucket
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');

-- Create a policy to allow authenticated users to upload to the product-images bucket
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Create a policy to allow authenticated users to update their own objects
CREATE POLICY "Allow authenticated updates"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images');

-- Create a policy to allow authenticated users to delete their own objects
CREATE POLICY "Allow authenticated deletes"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');
`.trim()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlScript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Storage Policies Setup</CardTitle>
          <CardDescription>SQL script to set up proper RLS policies for the product-images bucket</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Copy and run this SQL script in the Supabase SQL Editor to set up proper RLS policies for the
              product-images bucket:
            </p>

            <div className="relative">
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">{sqlScript}</pre>
              <Button size="sm" variant="ghost" className="absolute top-2 right-2" onClick={copyToClipboard}>
                <Copy className="h-4 w-4 mr-1" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>

            <Alert className="bg-yellow-50" variant="outline">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertTitle>Instructions</AlertTitle>
              <AlertDescription>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                  <li>Go to the Supabase dashboard</li>
                  <li>Navigate to the SQL Editor</li>
                  <li>Paste the SQL script above</li>
                  <li>Run the script</li>
                  <li>Return to your application and try uploading images again</li>
                </ol>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.history.back()}>
            Back
          </Button>
          <Button onClick={copyToClipboard}>{copied ? "Copied!" : "Copy SQL Script"}</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
