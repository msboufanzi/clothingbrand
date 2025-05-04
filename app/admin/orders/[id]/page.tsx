"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { ArrowLeft, Check, Clock, Truck, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { getOrderById, updateOrderStatus, type Order } from "@/lib/database"
import { useToast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchOrder() {
      try {
        setIsLoading(true)
        setError(null)

        // Get order details
        const orderData = await getOrderById(id)

        if (!orderData) {
          setError("Order not found")
          return
        }

        setOrder(orderData)
      } catch (error) {
        console.error("Error fetching order:", error)
        setError("Failed to load order details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  const handleStatusChange = async (status: Order["status"]) => {
    if (!order) return

    try {
      const updatedOrder = await updateOrderStatus(id, status)
      if (updatedOrder) {
        setOrder({ ...order, status })
        toast({
          title: "Status updated",
          description: `Order status has been updated to ${status}`,
        })
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-stone-50">
        <AdminSidebar />
        <div className="flex-1">
          <AdminHeader />
          <main className="p-6">
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
              <p>Loading order details...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen bg-stone-50">
        <AdminSidebar />
        <div className="flex-1">
          <AdminHeader />
          <main className="p-6">
            <Button asChild variant="ghost" className="mb-8">
              <Link href="/admin/orders" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Orders
              </Link>
            </Button>
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
              <h2 className="text-lg font-medium mb-2">Error</h2>
              <p>{error || "Failed to load order details"}</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <main className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <Button asChild variant="ghost" className="mb-2 -ml-2">
                <Link href="/admin/orders" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Orders
                </Link>
              </Button>
              <h1 className="text-3xl font-light">Order #{order.id.substring(0, 8)}</h1>
              <p className="text-gray-600">
                {order.created_at ? format(new Date(order.created_at), "MMMM dd, yyyy 'at' h:mm a") : "N/A"}
              </p>
            </div>
            <div className="flex gap-2"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-medium">{order.customer_name}</p>
                  <p>{order.customer_email}</p>
                  {order.customer_phone && <p>{order.customer_phone}</p>}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p>{order.shipping_address}</p>
                  <p>
                    {order.city}, {order.postal_code}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Badge
                    variant="outline"
                    className={`flex w-fit items-center gap-1 ${
                      order.status === "delivered"
                        ? "border-green-500 text-green-600"
                        : order.status === "processing"
                          ? "border-blue-500 text-blue-600"
                          : order.status === "pending"
                            ? "border-yellow-500 text-yellow-600"
                            : "border-red-500 text-red-600"
                    }`}
                  >
                    {order.status === "delivered" ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : order.status === "processing" ? (
                      <Clock className="h-3.5 w-3.5" />
                    ) : order.status === "pending" ? (
                      <Truck className="h-3.5 w-3.5" />
                    ) : (
                      <X className="h-3.5 w-3.5" />
                    )}
                    <span className="capitalize">{order.status}</span>
                  </Badge>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => handleStatusChange("pending")}>
                      Mark Pending
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleStatusChange("processing")}>
                      Mark Processing
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleStatusChange("delivered")}>
                      Mark Delivered
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleStatusChange("cancelled")}>
                      Mark Cancelled
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>Products included in this order</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.product_name}</TableCell>
                      <TableCell>{item.price.toLocaleString("fr-MA")} د.م.</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        {(item.price * item.quantity).toLocaleString("fr-MA")} د.م.
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{order.total.toLocaleString("fr-MA")} د.م.</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{order.total.toLocaleString("fr-MA")} د.م.</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
