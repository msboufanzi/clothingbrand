"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { getBrowserClient } from "@/lib/supabase-browser"

type AdminContextType = {
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => Promise<void>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = getBrowserClient()

        // First check if we have a session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Session check error:", sessionError)
          setIsAuthenticated(false)
          setIsLoading(false)
          return
        }

        // If no session, no need to check user
        if (!sessionData.session) {
          setIsAuthenticated(false)
          setIsLoading(false)
          return
        }

        // If we have a session, check the user
        const { data, error } = await supabase.auth.getUser()

        if (error) {
          console.error("Auth check error:", error)
          setIsAuthenticated(false)
          return
        }

        if (data.user) {
          // Check if user is an admin
          const { data: adminData, error: adminError } = await supabase
            .from("admin_users")
            .select("*")
            .eq("auth_id", data.user.id)
            .single()

          setIsAuthenticated(!adminError && !!adminData)
        } else {
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const logout = async () => {
    try {
      const supabase = getBrowserClient()
      await supabase.auth.signOut()
      setIsAuthenticated(false)
      router.replace("/admin/login")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return <AdminContext.Provider value={{ isAuthenticated, isLoading, logout }}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
