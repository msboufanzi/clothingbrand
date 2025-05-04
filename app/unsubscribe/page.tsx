"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function UnsubscribePage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")

    try {
      const response = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setStatus("success")
        setMessage("You have been successfully unsubscribed from our newsletter.")
        setEmail("")
      } else {
        const data = await response.json()
        setStatus("error")
        setMessage(data.error || "Failed to unsubscribe. Please try again.")
      }
    } catch (error) {
      setStatus("error")
      setMessage("An unexpected error occurred. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Unsubscribe from Newsletter</h1>

        {status === "success" ? (
          <div className="text-center">
            <div className="text-green-600 mb-4">{message}</div>
            <p className="text-gray-600">We're sorry to see you go. You can always subscribe again in the future.</p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6 text-center">
              Please enter your email address to unsubscribe from our newsletter.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="your@email.com"
                />
              </div>

              {status === "error" && <div className="text-red-600 text-sm">{message}</div>}

              <div className="flex justify-center">
                <Button type="submit" disabled={status === "loading"} className="w-full">
                  {status === "loading" ? "Processing..." : "Unsubscribe"}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
