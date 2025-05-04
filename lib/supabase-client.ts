import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

// Create a singleton instance of the Supabase client
let supabaseClient: ReturnType<typeof createClientComponentClient<Database>> | null = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClientComponentClient<Database>()
  }
  return supabaseClient
}

// Create a function that doesn't require authentication
export async function fetchPublicData(table: string, query: any = {}) {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from(table)
      .select(query.select || "*")
      .order(query.orderBy || "id", { ascending: query.ascending !== false })
      .limit(query.limit || 100)

    if (error) {
      console.error(`Error fetching ${table}:`, error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error(`Exception fetching ${table}:`, error)
    return { data: null, error }
  }
}
