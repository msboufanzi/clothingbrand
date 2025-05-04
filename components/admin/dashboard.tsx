"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { BarChart3, Package, ShoppingBag, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { RecentOrders } from "@/components/admin/recent-orders"
import { ProductsTable } from "@/components/admin/products-table"

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    ordersCount: 0,
    newOrdersToday: 0,
    productsCount: 0,
    newProductsThisWeek: 0,
    customersCount: 0,
    newCustomersThisWeek: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchStats() {
      try {
        // Get total revenue
        const { data: revenueData, error: revenueError } = await supabase.from("orders").select("total")
        if (revenueError) throw revenueError
        const totalRevenue = revenueData?.reduce((sum, order) => sum + (Number(order.total) || 0), 0) || 0

        // Get order counts
        const { count: ordersCount, error: ordersError } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
        if (ordersError) throw ordersError

        // Get new orders today
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const { count: newOrdersToday, error: newOrdersError } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .gte("created_at", today.toISOString())
        if (newOrdersError) throw newOrdersError

        // Get product count
        const { count: productsCount, error: productsError } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
        if (productsError) throw productsError

        // Get new products this week
        const lastWeek = new Date()
        lastWeek.setDate(lastWeek.getDate() - 7)
        const { count: newProductsThisWeek, error: newProductsError } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .gte("created_at", lastWeek.toISOString())
        if (newProductsError) throw newProductsError

        // Get customer count
        const { count: customersCount, error: customersError } = await supabase
          .from("customers")
          .select("*", { count: "exact", head: true })
        if (customersError) throw customersError

        // Get new customers this week
        const { count: newCustomersThisWeek, error: newCustomersError } = await supabase
          .from("customers")
          .select("*", { count: "exact", head: true })
          .gte("created_at", lastWeek.toISOString())
        if (newCustomersError) throw newCustomersError

        setStats({
          totalRevenue,
          ordersCount: ordersCount || 0,
          newOrdersToday: newOrdersToday || 0,
          productsCount: productsCount || 0,
          newProductsThisWeek: newProductsThisWeek || 0,
          customersCount: customersCount || 0,
          newCustomersThisWeek: newCustomersThisWeek || 0,
        })
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [supabase])

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />

      <div className="flex-1">
        <AdminHeader />

        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-light">Dashboard</h1>
            <p className="text-gray-600">Welcome to Echaly admin panel</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <BarChart3 className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "Loading..." : `${stats.totalRevenue.toLocaleString("fr-MA")} د.م.`}
                </div>
                <p className="text-xs text-gray-500">+18% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoading ? "Loading..." : stats.ordersCount}</div>
                <p className="text-xs text-gray-500">
                  {isLoading ? "Loading..." : `+${stats.newOrdersToday} new today`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <Package className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoading ? "Loading..." : stats.productsCount}</div>
                <p className="text-xs text-gray-500">
                  {isLoading ? "Loading..." : `${stats.newProductsThisWeek} added this week`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoading ? "Loading..." : stats.customersCount}</div>
                <p className="text-xs text-gray-500">
                  {isLoading ? "Loading..." : `+${stats.newCustomersThisWeek} this week`}
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="orders">
            <TabsList className="mb-6">
              <TabsTrigger value="orders">Recent Orders</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-light">Recent Orders</h2>
                <Button asChild>
                  <Link href="/admin/orders">View All</Link>
                </Button>
              </div>
              <RecentOrders />
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-light">Products</h2>
                <Button asChild>
                  <Link href="/admin/products">Manage Products</Link>
                </Button>
              </div>
              <ProductsTable />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
