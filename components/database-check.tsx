"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"

export function DatabaseCheck() {
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const checkDatabase = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Missing Supabase credentials")
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey)

      // Check if products table exists and has data
      const { data: products, error: productsError } = await supabase.from("products").select("id, name").limit(5)

      if (productsError) {
        throw new Error(`Products query error: ${productsError.message}`)
      }

      // Get table list
      const { data: tables, error: tablesError } = await supabase
        .from("pg_tables")
        .select("tablename")
        .eq("schemaname", "public")

      if (tablesError) {
        console.warn("Could not fetch tables:", tablesError)
      }

      setResults({
        productCount: products.length,
        sampleProducts: products,
        tables: tables || [],
        timestamp: new Date().toISOString(),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-medium mb-4">Database Connection Check</h2>

      <button
        onClick={checkDatabase}
        disabled={isLoading}
        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-400"
      >
        {isLoading ? "Checking..." : "Check Database Connection"}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {results && (
        <div className="mt-4">
          <h3 className="font-medium">Results:</h3>
          <div className="mt-2 p-3 bg-gray-100 rounded overflow-auto max-h-80">
            <p>
              <strong>Products found:</strong> {results.productCount}
            </p>

            {results.productCount > 0 && (
              <div className="mt-2">
                <p>
                  <strong>Sample products:</strong>
                </p>
                <ul className="list-disc pl-5">
                  {results.sampleProducts.map((p: any) => (
                    <li key={p.id}>
                      {p.name} (ID: {p.id})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-2">
              <p>
                <strong>Tables in database:</strong>
              </p>
              <ul className="list-disc pl-5">
                {results.tables.map((t: any, i: number) => (
                  <li key={i}>{t.tablename}</li>
                ))}
              </ul>
            </div>

            <p className="mt-2 text-xs text-gray-500">Checked at: {results.timestamp}</p>
          </div>
        </div>
      )}
    </div>
  )
}
