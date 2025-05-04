import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin/dashboard"
import { getServerClient } from "@/lib/supabase-server"

export default async function DashboardPage() {
  const supabase = getServerClient()

  // Check if user is authenticated
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    console.log("Dashboard: No authenticated user, redirecting to login")
    redirect("/admin/login")
  }

  // Check if user is an admin
  const { data: adminUser, error: adminError } = await supabase
    .from("admin_users")
    .select("*")
    .eq("auth_id", data.user.id)
    .single()

  if (adminError || !adminUser) {
    console.log("Dashboard: User is not an admin, redirecting to login")
    // Sign out the user
    await supabase.auth.signOut()
    redirect("/admin/login")
  }

  // User is authenticated and is an admin, show dashboard
  return <AdminDashboard />
}
