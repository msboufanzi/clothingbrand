import { redirect } from "next/navigation"

export default function AdminPage() {
  // Redirect directly to the dashboard
  redirect("/admin/dashboard")
}
