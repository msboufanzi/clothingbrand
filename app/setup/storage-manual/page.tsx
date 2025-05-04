import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { InfoIcon } from "lucide-react"

export default function StorageManualSetupPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Manual Storage Setup Guide</CardTitle>
          <CardDescription>Follow these steps to set up your storage bucket manually</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              This guide will help you set up the storage bucket manually through the Supabase dashboard.
            </AlertDescription>
          </Alert>

          <div>
            <h3 className="text-lg font-medium mb-2">Step 1: Create the Bucket</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                Go to the{" "}
                <a
                  href="https://app.supabase.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Supabase Dashboard
                </a>
              </li>
              <li>Select your project</li>
              <li>Navigate to "Storage" in the left sidebar</li>
              <li>Click "Create bucket"</li>
              <li>Name it "product-images"</li>
              <li>Check "Public bucket" to make it accessible to everyone</li>
              <li>Click "Create bucket" to save</li>
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Step 2: Set Up RLS Policies</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>In the Storage section, click on "Policies"</li>
              <li>Click "Add policy" to create a new policy</li>
              <li>Create the following policies:</li>
            </ol>

            <div className="mt-4 space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Policy 1: Allow authenticated users to upload</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Name: "authenticated users can upload"</li>
                  <li>Bucket: "product-images"</li>
                  <li>Operation: "INSERT"</li>
                  <li>Role: "authenticated"</li>
                  <li>
                    Definition: <code>bucket_id = 'product-images'</code>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Policy 2: Allow authenticated users to update</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Name: "authenticated users can update"</li>
                  <li>Bucket: "product-images"</li>
                  <li>Operation: "UPDATE"</li>
                  <li>Role: "authenticated"</li>
                  <li>
                    Definition: <code>bucket_id = 'product-images'</code>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Policy 3: Allow authenticated users to delete</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Name: "authenticated users can delete"</li>
                  <li>Bucket: "product-images"</li>
                  <li>Operation: "DELETE"</li>
                  <li>Role: "authenticated"</li>
                  <li>
                    Definition: <code>bucket_id = 'product-images'</code>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Policy 4: Allow everyone to read</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Name: "everyone can read"</li>
                  <li>Bucket: "product-images"</li>
                  <li>Operation: "SELECT"</li>
                  <li>Role: "public"</li>
                  <li>
                    Definition: <code>bucket_id = 'product-images'</code>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Step 3: Test Your Setup</h3>
            <p className="mb-2">After completing the setup, you should test it by:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Logging into your admin account</li>
              <li>Going to the Products page</li>
              <li>Creating a new product with images</li>
              <li>Verifying that the images appear correctly</li>
            </ol>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/admin/products">Go to Products</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
