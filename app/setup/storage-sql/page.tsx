"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, Copy } from "lucide-react"
import Link from "next/link"

export default function SetupStorageSQLPage() {
  const [copied, setCopied] = useState(false)

  const sqlScript = `
-- Run this SQL in the Supabase SQL Editor

-- 1. Create the bucket if it doesn't exist (this part needs to be done via the UI or API)
-- Go to Storage in Supabase dashboard and create a bucket named "product-images" if it doesn't exist
-- Make sure to check "Public bucket" when creating it

-- 2. Set up RLS policies for the bucket
CREATE POLICY "authenticated users can upload" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "authenticated users can update" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'product-images');

CREATE POLICY "authenticated users can delete" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'product-images');

CREATE POLICY "everyone can read" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'product-images');

-- 3. Create a helper function to get public URLs
CREATE OR REPLACE FUNCTION public.get_public_url(bucket TEXT, path TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'https://your-project-ref.supabase.co/storage/v1/object/public/' || bucket || '/' || path;
END;
$$;

-- Replace 'https://your-project-ref.supabase.co' with your actual Supabase URL
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
          <CardTitle>Storage Setup - SQL Method</CardTitle>
          <CardDescription>
            If the automatic setup doesn't work, you can run this SQL script in the Supabase SQL Editor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">{sqlScript}</pre>
            <Button size="sm" variant="ghost" className="absolute top-2 right-2" onClick={copyToClipboard}>
              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <Alert className="mt-4 bg-blue-50" variant="outline">
            <AlertTitle>Instructions</AlertTitle>
            <AlertDescription>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Copy the SQL script above</li>
                <li>Go to the Supabase dashboard for your project</li>
                <li>Click on "SQL Editor" in the left sidebar</li>
                <li>Paste the script and run it</li>
                <li>
                  Make sure to replace 'https://your-project-ref.supabase.co' with your actual Supabase URL in the last
                  function
                </li>
                <li>
                  Also create the "product-images" bucket in the Storage section if it doesn't exist, and make sure to
                  check "Public bucket"
                </li>
              </ol>
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button variant="outline" asChild className="w-full">
            <Link href="/admin/products">Go to Products</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
