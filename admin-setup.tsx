"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminSetup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("Admin")
  const [lastName, setLastName] = useState("User")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  )

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setMessage("")

    try {
      // 1. Create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
        },
      })

      if (authError) throw authError

      if (!authData.user) {
        throw new Error("Failed to create user")
      }

      // 2. Create the admin user record
      const { error: adminError } = await supabase.from("admin_users").insert([
        {
          auth_id: authData.user.id,
          email,
          first_name: firstName,
          last_name: lastName,
          role: "admin",
        },
      ])

      if (adminError) throw adminError

      setStatus("success")
      setMessage(`Admin user created successfully! You can now log in with ${email}`)
    } catch (error: any) {
      console.error("Error creating admin:", error)
      setStatus("error")
      setMessage(error.message || "Failed to create admin user")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Admin User</CardTitle>
          <CardDescription>Set up the initial admin user for Echaly</CardDescription>
        </CardHeader>
        <CardContent>
          {status === "success" ? (
            <div className="bg-green-50 p-4 rounded-md text-green-800 mb-4">{message}</div>
          ) : status === "error" ? (
            <div className="bg-red-50 p-4 rounded-md text-red-800 mb-4">{message}</div>
          ) : null}

          <form onSubmit={handleCreateAdmin}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-500">Password must be at least 6 characters</p>
              </div>

              <Button type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Creating..." : "Create Admin User"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">This page should be protected in production</p>
        </CardFooter>
      </Card>
    </div>
  )
}
