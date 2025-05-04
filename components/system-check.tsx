"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

type CheckResult = {
  name: string
  status: "success" | "error" | "pending"
  message: string
}

export function SystemCheck() {
  const [checks, setChecks] = useState<CheckResult[]>([
    { name: "Environment Variables", status: "pending", message: "Checking..." },
    { name: "Supabase Connection", status: "pending", message: "Checking..." },
    { name: "Products Table", status: "pending", message: "Checking..." },
    { name: "API Endpoints", status: "pending", message: "Checking..." },
    { name: "Browser Compatibility", status: "pending", message: "Checking..." },
  ])
  const [deviceInfo, setDeviceInfo] = useState<string>("")

  useEffect(() => {
    const runChecks = async () => {
      // Check environment variables
      const envCheck = { ...checks[0] }
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseAnonKey) {
          envCheck.status = "error"
          envCheck.message = "Missing Supabase environment variables"
        } else {
          envCheck.status = "success"
          envCheck.message = "Environment variables are set correctly"
        }
      } catch (error) {
        envCheck.status = "error"
        envCheck.message = "Error checking environment variables"
      }

      setChecks((prev) => {
        const newChecks = [...prev]
        newChecks[0] = envCheck
        return newChecks
      })

      // Check Supabase connection
      const supabaseCheck = { ...checks[1] }
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error("Missing Supabase credentials")
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey)
        const { data, error } = await supabase.from("products").select("count()", { count: "exact" })

        if (error) {
          throw error
        }

        supabaseCheck.status = "success"
        supabaseCheck.message = "Connected to Supabase successfully"
      } catch (error) {
        supabaseCheck.status = "error"
        supabaseCheck.message = error instanceof Error ? error.message : "Failed to connect to Supabase"
      }

      setChecks((prev) => {
        const newChecks = [...prev]
        newChecks[1] = supabaseCheck
        return newChecks
      })

      // Check products table
      const productsCheck = { ...checks[2] }
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error("Missing Supabase credentials")
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey)
        const { data, error, count } = await supabase.from("products").select("id", { count: "exact" }).limit(1)

        if (error) {
          throw error
        }

        productsCheck.status = "success"
        productsCheck.message = `Products table accessible, contains ${count} products`
      } catch (error) {
        productsCheck.status = "error"
        productsCheck.message = error instanceof Error ? error.message : "Failed to access products table"
      }

      setChecks((prev) => {
        const newChecks = [...prev]
        newChecks[2] = productsCheck
        return newChecks
      })

      // Check API endpoints
      const apiCheck = { ...checks[3] }
      try {
        const response = await fetch(`/api/universal-products?_t=${Date.now()}`)

        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`)
        }

        const data = await response.json()

        if (!Array.isArray(data)) {
          throw new Error("API did not return an array")
        }

        apiCheck.status = "success"
        apiCheck.message = `API endpoint working, returned ${data.length} products`
      } catch (error) {
        apiCheck.status = "error"
        apiCheck.message = error instanceof Error ? error.message : "Failed to access API endpoint"
      }

      setChecks((prev) => {
        const newChecks = [...prev]
        newChecks[3] = apiCheck
        return newChecks
      })

      // Check browser compatibility
      const browserCheck = { ...checks[4] }
      try {
        const userAgent = navigator.userAgent
        const isIOS = /iPhone|iPad|iPod/.test(userAgent)
        const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent)
        const isIOSSafari = isIOS && isSafari
        const isIOSChrome = isIOS && /CriOS/.test(userAgent)

        setDeviceInfo(
          `${isIOS ? "iOS" : "Non-iOS"} / ${isSafari ? "Safari" : "Non-Safari"} / ${isIOSChrome ? "iOS Chrome" : "Other Browser"}`,
        )

        browserCheck.status = "success"
        browserCheck.message = `Browser: ${navigator.userAgent.split(" ").slice(-2).join(" ")}`
      } catch (error) {
        browserCheck.status = "error"
        browserCheck.message = "Failed to detect browser"
      }

      setChecks((prev) => {
        const newChecks = [...prev]
        newChecks[4] = browserCheck
        return newChecks
      })
    }

    runChecks()
  }, [])

  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-100 rounded mb-6">
        <h2 className="font-medium mb-2">Device Information</h2>
        <p className="text-sm">{deviceInfo || "Detecting..."}</p>
      </div>

      <div className="space-y-4">
        {checks.map((check, index) => (
          <div
            key={index}
            className={`p-4 rounded border ${
              check.status === "success"
                ? "bg-green-50 border-green-200"
                : check.status === "error"
                  ? "bg-red-50 border-red-200"
                  : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{check.name}</h3>
              <span
                className={`px-2 py-1 text-xs rounded ${
                  check.status === "success"
                    ? "bg-green-100 text-green-800"
                    : check.status === "error"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {check.status === "success" ? "Success" : check.status === "error" ? "Error" : "Checking..."}
              </span>
            </div>
            <p className="mt-2 text-sm">{check.message}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Run Checks Again
        </button>
      </div>
    </div>
  )
}
