import { DatabaseCheck } from "@/components/database-check"

export const metadata = {
  title: "Database Check",
}

export default function DatabaseCheckPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Database Connection Check</h1>
      <p className="mb-6">This page tests the direct database connection from the browser.</p>

      <DatabaseCheck />
    </div>
  )
}
