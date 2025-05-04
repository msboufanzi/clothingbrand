"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getBrowserClient } from "@/lib/supabase-browser"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = getBrowserClient()

        // First check if we have a session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Session check error:", sessionError)
          setIsCheckingAuth(false)
          return
        }

        // If no session, no need to check user
        if (!sessionData.session) {
          setIsCheckingAuth(false)
          return
        }

        // If we have a session, check the user
        const { data, error } = await supabase.auth.getUser()

        if (error) {
          console.error("Auth check error:", error)
          setIsCheckingAuth(false)
          return
        }

        if (data.user) {
          // Check if user is an admin
          const { data: adminData, error: adminError } = await supabase
            .from("admin_users")
            .select("*")
            .eq("auth_id", data.user.id)
            .single()

          if (!adminError && adminData) {
            console.log("User is already logged in and is an admin, redirecting to admin")
            // User is authenticated and is an admin, redirect to admin
            router.replace("/admin")
            return
          }
        }
      } catch (err) {
        console.error("Error checking authentication:", err)
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = getBrowserClient()

      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (data.user) {
        // Check if user is an admin
        const { data: adminData, error: adminError } = await supabase
          .from("admin_users")
          .select("*")
          .eq("auth_id", data.user.id)
          .single()

        if (adminError || !adminData) {
          // Sign out if not an admin
          await supabase.auth.signOut()
          throw new Error("You don't have admin privileges")
        }

        console.log("Login successful, redirecting to admin")
        // Successful login - redirect to admin
        router.replace("/admin")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "Failed to login")
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabase = getBrowserClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      })

      if (error) {
        throw error
      }

      alert("Password reset link sent to your email")
    } catch (error: any) {
      console.error("Reset password error:", error)
      setError(error.message || "Failed to send reset password email")
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="mb-4">Loading...</div>
          <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-gray-500"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-2xl font-bold">Admin Login</h1>
          <p className="text-gray-600">Sign in to access the admin dashboard</p>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
              required
            />
          </div>

          <div className="mb-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800 focus:outline-none disabled:bg-gray-400"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={handleForgotPassword}
            disabled={isLoading}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  )
}
