"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Info } from "lucide-react"

export default function EmailDebugPage() {
  const [to, setTo] = useState("boufanzi@gmail.com")
  const [subject, setSubject] = useState("Test Email from Echaly")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; details?: any } | null>(null)

  const sendTestEmail = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/email-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to,
          subject,
          body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="text-align: center; color: #333;">Test Email</h1>
              <p>This is a test email from Echaly Fashion.</p>
              <p>If you're receiving this email, it means your email notification system is working correctly.</p>
              <p>Time sent: ${new Date().toLocaleString()}</p>
            </div>
          `,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setResult({
          success: true,
          message: data.simulated
            ? "Email simulation successful! In a real environment, an email would be sent."
            : "Email sent successfully!",
          details: data,
        })
      } else {
        setResult({
          success: false,
          message: `Failed to send email: ${data.error || "Unknown error"}`,
          details: data,
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: `Error: ${(error as Error).message}`,
        details: error,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Email System Debug</h1>

      <div className="grid gap-6 mb-8">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>v0 Preview Environment</AlertTitle>
          <AlertDescription>
            You're in a v0 preview environment. Email sending will be simulated for testing purposes. When deployed to
            production, real emails will be sent using your configured SMTP settings.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Current Email Configuration</CardTitle>
            <CardDescription>These are the email settings currently configured</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="font-medium">SMTP Host:</span>
                <span>{process.env.SMTP_HOST || "Not configured"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">SMTP Port:</span>
                <span>{process.env.SMTP_PORT || "Not configured"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">SMTP User:</span>
                <span>{process.env.SMTP_USER ? "Configured" : "Not configured"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Site URL:</span>
                <span>{process.env.NEXT_PUBLIC_SITE_URL || "Not configured"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Admin Email:</span>
                <span>{process.env.NEXT_PUBLIC_ADMIN_EMAIL || "Not configured"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Send Test Email</CardTitle>
            <CardDescription>Send a test email to verify your configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="to">Recipient Email</Label>
                <Input id="to" value={to} onChange={(e) => setTo(e.target.value)} placeholder="recipient@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Test Email"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={sendTestEmail} disabled={loading}>
              {loading ? "Sending..." : "Send Test Email"}
            </Button>
          </CardFooter>
        </Card>

        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>
              <p>{result.message}</p>
              {result.details && (
                <pre className="mt-2 bg-slate-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(result.details, null, 2)}
                </pre>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Production Email Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">For your production environment, make sure you have these environment variables set:</p>
            <pre className="bg-slate-100 p-4 rounded text-xs overflow-auto">
              {`SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
NEXT_PUBLIC_SITE_URL=https://your-domain.com`}
            </pre>

            <div className="mt-6">
              <h3 className="font-medium mb-2">Gmail App Password Instructions:</h3>
              <ol className="list-decimal pl-6 space-y-1">
                <li>Go to your Google Account settings</li>
                <li>Select "Security"</li>
                <li>Under "Signing in to Google," select "App passwords"</li>
                <li>Generate a new app password for "Mail" and "Other (Custom name)"</li>
                <li>Use this password as your SMTP_PASSWORD</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
