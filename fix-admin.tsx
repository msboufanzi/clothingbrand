"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function FixAdmin() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [authUsers, setAuthUsers] = useState<any[]>([])
  const [adminUsers, setAdminUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  )

  useEffect(() => {
    async function fetchUsers() {
      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          setEmail(user.email || "")
        }

        // Fetch admin users
        const { data: admins, error: adminsError } = await supabase.from("admin_users").select("*")

        if (adminsError) throw adminsError

        setAdminUsers(admins || [])
      } catch (error) {
        console.error("Error fetching users:", error)
        setMessage("Error fetching users. Check console for details.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleFixAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setMessage("")

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("You need to be logged in to fix admin access")
      }

      // Check if user already exists in admin_users
      const { data: existingAdmin } = await supabase.from("admin_users").select("*").eq("auth_id", user.id).single()

      if (existingAdmin) {
        setMessage(`User ${user.email} is already an admin. ID: ${existingAdmin.id}`)
        setStatus("success")
        return
      }

      // Create admin user record
      const { data: newAdmin, error: adminError } = await supabase
        .from("admin_users")
        .insert([
          {
            auth_id: user.id,
            email: user.email,
            first_name: "Admin",
            last_name: "User",
            role: "admin",
          },
        ])
        .select()

      if (adminError) throw adminError

      setStatus("success")
      setMessage(`Admin access granted to ${user.email}. You can now log in to the admin dashboard.`)

      // Refresh admin users list
      const { data: admins } = await supabase.from("admin_users").select("*")

      setAdminUsers(admins || [])
    } catch (error: any) {
      console.error("Error fixing admin:", error)
      setStatus("error")
      setMessage(error.message || "Failed to fix admin access")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Fix Admin Access</CardTitle>
          <CardDescription>Grant admin privileges to your current user</CardDescription>
        </CardHeader>
        <CardContent>
          {status === "success" ? (
            <div className="bg-green-50 p-4 rounded-md text-green-800 mb-4">{message}</div>
          ) : status === "error" ? (
            <div className="bg-red-50 p-4 rounded-md text-red-800 mb-4">{message}</div>
          ) : null}

          {isLoading ? (
            <p>Loading user information...</p>
          ) : (
            <>
              <div className="mb-6">
                <p className="mb-2">
                  <strong>Current user:</strong> {email || "Not logged in"}
                </p>

                <div className="mt-4">
                  <h3 className="font-medium mb-2">Existing Admin Users:</h3>
                  {adminUsers.length === 0 ? (
                    <p className="text-gray-500">No admin users found</p>
                  ) : (
                    <ul className="list-disc pl-5">
                      {adminUsers.map((admin) => (
                        <li key={admin.id}>
                          {admin.email} ({admin.first_name} {admin.last_name})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <form onSubmit={handleFixAdmin}>
                <Button type="submit" disabled={status === "loading" || !email} className="w-full">
                  {status === "loading" ? "Processing..." : "Grant Admin Access to Current User"}
                </Button>
              </form>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">You must be logged in with the user you want to grant admin access to</p>
        </CardFooter>
      </Card>
    </div>
  )
}
