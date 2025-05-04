"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, CheckCircleIcon, AlertCircleIcon } from "lucide-react"

export default function TestEmailPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const checkEmailConfig = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-email")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, error: (error as Error).message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Email Configuration Checker</CardTitle>
          <CardDescription>Verify your SMTP settings for email notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Preview Mode Notice</AlertTitle>
            <AlertDescription>
              In preview mode, we can't actually send emails due to browser limitations. This tool will check if your
              SMTP configuration appears valid.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <p>
              This will check your SMTP configuration for sending emails to{" "}
              <strong>{process.env.NEXT_PUBLIC_ADMIN_EMAIL || "boufanzi@gmail.com"}</strong>.
            </p>
            <Button onClick={checkEmailConfig} disabled={isLoading}>
              {isLoading ? "Checking..." : "Check Email Configuration"}
            </Button>

            {result && (
              <div className={`mt-4 p-4 rounded-md ${result.success ? "bg-green-50" : "bg-red-50"}`}>
                <div className="flex items-start">
                  {result.success ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  ) : (
                    <AlertCircleIcon className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                  )}
                  <div>
                    <h3 className={`font-medium ${result.success ? "text-green-800" : "text-red-800"}`}>
                      {result.success ? "Configuration Looks Valid" : "Configuration Issue Detected"}
                    </h3>
                    <p className={`mt-1 ${result.success ? "text-green-700" : "text-red-700"}`}>
                      {result.message || result.error}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium">SMTP Settings:</h4>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>
                      <strong>Host:</strong> {result.smtpSettings?.host}
                    </li>
                    <li>
                      <strong>Port:</strong> {result.smtpSettings?.port}
                    </li>
                    <li>
                      <strong>Secure:</strong> {result.smtpSettings?.secure ? "Yes" : "No"}
                    </li>
                    <li>
                      <strong>User:</strong> {result.smtpSettings?.user}
                    </li>
                    <li>
                      <strong>From:</strong> {result.smtpSettings?.from}
                    </li>
                    <li>
                      <strong>Admin Email:</strong> {result.smtpSettings?.adminEmail}
                    </li>
                  </ul>
                </div>

                {!result.success && (
                  <div className="mt-4 p-3 bg-white rounded border border-red-200">
                    <h4 className="font-medium text-red-800">Troubleshooting Steps:</h4>
                    <ol className="mt-2 space-y-1 text-sm list-decimal pl-4">
                      <li>Verify that all SMTP settings are correctly set in your .env.local file</li>
                      <li>If using Gmail, make sure "Less secure app access" is enabled or use an App Password</li>
                      <li>Check that the SMTP_PORT is correct (usually 587 for TLS or 465 for SSL)</li>
                      <li>
                        Ensure NEXT_PUBLIC_ADMIN_EMAIL is set to the email where you want to receive notifications
                      </li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 border-t pt-4">
              <h3 className="font-medium mb-2">Email Notification System</h3>
              <p className="text-sm text-gray-600 mb-4">
                To ensure email notifications work correctly in your production environment:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-sm">
                <li>
                  <strong>Set up your .env.local file</strong> with the correct SMTP settings:
                  <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                    SMTP_HOST=smtp.gmail.com
                    <br />
                    SMTP_PORT=587
                    <br />
                    SMTP_SECURE=false
                    <br />
                    SMTP_USER=your-email@gmail.com
                    <br />
                    SMTP_PASSWORD=your-password
                    <br />
                    SMTP_FROM=your-email@gmail.com
                    <br />
                    NEXT_PUBLIC_ADMIN_EMAIL=boufanzi@gmail.com
                  </pre>
                </li>
                <li>
                  <strong>If using Gmail</strong>, you'll need to either:
                  <ul className="list-disc pl-5 mt-1">
                    <li>Enable "Less secure app access" in your Google account settings, or</li>
                    <li>Create an App Password if you have 2-factor authentication enabled</li>
                  </ul>
                </li>
                <li>
                  <strong>Deploy your application</strong> to a production environment where real emails can be sent
                </li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
