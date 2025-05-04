"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { getDashboardStats } from "@/lib/database"

// Mock data for charts
const salesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4500 },
  { name: "May", sales: 6000 },
  { name: "Jun", sales: 5500 },
  { name: "Jul", sales: 7000 },
  { name: "Aug", sales: 8000 },
  { name: "Sep", sales: 7500 },
  { name: "Oct", sales: 9000 },
  { name: "Nov", sales: 10000 },
  { name: "Dec", sales: 12000 },
]

const categoryData = [
  { name: "Casual", value: 40 },
  { name: "Evening", value: 30 },
  { name: "Summer", value: 20 },
  { name: "Winter", value: 10 },
]

const customerData = [
  { name: "Jan", new: 40, returning: 24 },
  { name: "Feb", new: 30, returning: 28 },
  { name: "Mar", new: 45, returning: 32 },
  { name: "Apr", new: 50, returning: 35 },
  { name: "May", new: 55, returning: 40 },
  { name: "Jun", new: 60, returning: 45 },
  { name: "Jul", new: 65, returning: 50 },
  { name: "Aug", new: 70, returning: 55 },
  { name: "Sep", new: 75, returning: 60 },
  { name: "Oct", new: 80, returning: 65 },
  { name: "Nov", new: 85, returning: 70 },
  { name: "Dec", new: 90, returning: 75 },
]

export default function AnalyticsPage() {
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

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />

      <div className="flex-1">
        <AdminHeader />

        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-light">Analytics</h1>
            <p className="text-gray-600">Track your store performance</p>
          </div>

          <Tabs defaultValue="sales">
            <TabsList className="mb-6">
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
            </TabsList>

            <TabsContent value="sales" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {isLoading ? "Loading..." : `${stats.totalRevenue.toLocaleString("fr-MA")} د.م.`}
                    </div>
                    <p className="text-xs text-gray-500">+18% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {isLoading || stats.ordersCount === 0
                        ? "Loading..."
                        : `${(stats.totalRevenue / stats.ordersCount).toLocaleString("fr-MA")} د.م.`}
                    </div>
                    <p className="text-xs text-gray-500">+5% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3.2%</div>
                    <p className="text-xs text-gray-500">+0.5% from last month</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Sales</CardTitle>
                  <CardDescription>Sales performance over the past year</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value.toLocaleString("fr-MA")} د.م.`} />
                        <Legend />
                        <Bar dataKey="sales" name="Sales (MAD)" fill="#000000" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{isLoading ? "Loading..." : stats.productsCount}</div>
                    <p className="text-xs text-gray-500">
                      {isLoading ? "Loading..." : `+${stats.newProductsThisWeek} this week`}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Best Selling Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Evening</div>
                    <p className="text-xs text-gray-500">40% of total sales</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Low Stock Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-gray-500">Requires attention</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                  <CardDescription>Distribution of sales across product categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend />
                        <Bar dataKey="value" name="Percentage of Sales" fill="#000000" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customers" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{isLoading ? "Loading..." : stats.customersCount}</div>
                    <p className="text-xs text-gray-500">
                      {isLoading ? "Loading..." : `+${stats.newCustomersThisWeek} this week`}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Returning Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">65%</div>
                    <p className="text-xs text-gray-500">+5% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Average Customer Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {isLoading || stats.customersCount === 0
                        ? "Loading..."
                        : `${(stats.totalRevenue / stats.customersCount).toLocaleString("fr-MA")} د.م.`}
                    </div>
                    <p className="text-xs text-gray-500">Lifetime value</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Growth</CardTitle>
                  <CardDescription>New vs returning customers over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={customerData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="new" name="New Customers" stroke="#000000" />
                        <Line type="monotone" dataKey="returning" name="Returning Customers" stroke="#888888" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
