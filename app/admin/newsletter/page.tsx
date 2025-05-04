import { getServerClient } from "@/lib/supabase-server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trash2, Send } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function NewsletterPage() {
  const supabase = getServerClient()

  const { data: subscribers, error } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching newsletter subscribers:", error)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Newsletter Subscribers</h1>
          <p className="text-gray-500 mt-1">Manage your newsletter subscribers</p>
        </div>
        <Link href="/admin/newsletter/send">
          <Button className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Send Newsletter
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date Subscribed
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscribers && subscribers.length > 0 ? (
                subscribers.map((subscriber) => (
                  <tr key={subscriber.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {subscriber.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(subscriber.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <form action="/api/newsletter/delete" method="POST">
                        <input type="hidden" name="id" value={subscriber.id} />
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" type="submit">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </form>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                    No subscribers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
