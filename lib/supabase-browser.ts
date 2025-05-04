import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

// Create a single instance of the Supabase client to be reused
let supabaseClient: ReturnType<typeof createClientComponentClient<Database>> | null = null

export function getBrowserClient() {
  if (!supabaseClient) {
    try {
      supabaseClient = createClientComponentClient<Database>({
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      })
    } catch (error) {
      console.error("Error creating Supabase client:", error)
      // Create a fallback client with environment variables
      supabaseClient = createClientComponentClient<Database>()
    }
  }
  return supabaseClient
}
