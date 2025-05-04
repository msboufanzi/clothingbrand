"use client"

import { useState, useEffect } from "react"

export default function ApiTestPage() {
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function testApi() {
      try {
        setIsLoading(true)

        // Add timestamp to prevent caching
        const url = new URL("/api/safari-compatible/products", window.location.origin)
        url.searchParams.append("_t", Date.now().toString())

        const response = await fetch(url.toString())

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        setApiResponse(data)
        setIsLoading(false)
      } catch (err) {
        console.error("API test error:", err)
        setError(err.message)
        setIsLoading(false)
      }
    }

    testApi()
  }, [])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">API Test</h1>

      {isLoading && <p>Loading...</p>}

      {error && (
        <div className="bg-red-100 p-4 rounded mb-4">
          <p className="text-red-700">Error: {error}</p>
        </div>
      )}

      {apiResponse && (
        <div>
          <p className="mb-4">Products returned: {Array.isArray(apiResponse) ? apiResponse.length : "Not an array"}</p>

          <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Browser Information</h2>
        <p>User Agent: {navigator.userAgent}</p>
      </div>
    </div>
  )
}
