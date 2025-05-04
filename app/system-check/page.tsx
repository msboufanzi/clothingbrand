import { SystemCheck } from "@/components/system-check"

export const metadata = {
  title: "System Check - Echaly",
}

export default function SystemCheckPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">System Check</h1>
      <p className="mb-6">This page checks various system components to ensure everything is working correctly.</p>

      <SystemCheck />
    </div>
  )
}
