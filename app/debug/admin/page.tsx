"use client"

import { useState, useEffect } from "react"
import { getBrowserClient } from "@/lib/supabase-browser"

export default function AdminDebugPage() {
  const [status, setStatus] = useState<string>("Checking...")
  const [error, setError] = useState<string | null>(null)
  const [session, setSession] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [adminUser, setAdminUser] = useState<any>(null)

  useEffect(() => {
    async function checkAuth() {
      try {
        setStatus("Initializing Supabase client...")
        const supabase = getBrowserClient()

        setStatus("Checking session...")
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          throw new Error(`Session error: ${sessionError.message}`)
        }

        setSession(sessionData.session)

        if (!sessionData.session) {
          setStatus("No active session found")
          return
        }

        setStatus("Getting user data...")
        const { data: userData, error: userError } = await supabase.auth.getUser()

        if (userError) {
          throw new Error(`User error: ${userError.message}`)
        }

        setUser(userData.user)

        if (!userData.user) {
          setStatus("No user found in session")
          return
        }

        setStatus("Checking admin status...")
        const { data: adminData, error: adminError } = await supabase
          .from("admin_users")
          .select("*")
          .eq("auth_id", userData.user.id)
          .single()

        if (adminError) {
          if (adminError.code === "PGRST116") {
            setStatus("User is not an admin")
          } else {
            throw new Error(`Admin check error: ${adminError.message}`)
          }
          return
        }

        setAdminUser(adminData)
        setStatus("User is an admin")
      } catch (err: any) {
        console.error("Debug error:", err)
        setError(err.message || "An unknown error occurred")
        setStatus("Error occurred")
      }
    }

    checkAuth()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Admin Authentication Debug</h1>

      <div className="mb-4 rounded-md bg-gray-100 p-4">
        <h2 className="mb-2 text-lg font-semibold">Status</h2>
        <p className={`${error ? "text-red-600" : "text-green-600"}`}>{status}</p>
        {error && <p className="mt-2 text-red-600">Error: {error}</p>}
      </div>

      <div className="mb-4 rounded-md bg-gray-100 p-4">
        <h2 className="mb-2 text-lg font-semibold">Session</h2>
        {session ? (
          <pre className="overflow-auto rounded-md bg-gray-800 p-2 text-sm text-white">
            {JSON.stringify(session, null, 2)}
          </pre>
        ) : (
          <p>No session data available</p>
        )}
      </div>

      <div className="mb-4 rounded-md bg-gray-100 p-4">
        <h2 className="mb-2 text-lg font-semibold">User</h2>
        {user ? (
          <pre className="overflow-auto rounded-md bg-gray-800 p-2 text-sm text-white">
            {JSON.stringify(user, null, 2)}
          </pre>
        ) : (
          <p>No user data available</p>
        )}
      </div>

      <div className="rounded-md bg-gray-100 p-4">
        <h2 className="mb-2 text-lg font-semibold">Admin Status</h2>
        {adminUser ? (
          <pre className="overflow-auto rounded-md bg-gray-800 p-2 text-sm text-white">
            {JSON.stringify(adminUser, null, 2)}
          </pre>
        ) : (
          <p>Not an admin user</p>
        )}
      </div>

      <div className="mt-4">
        <a href="/admin/login" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Go to Login Page
        </a>
      </div>
    </div>
  )
}
