"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Check, Clock, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function RecentOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5)

        if (error) throw error
        setOrders(data || [])
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [supabase])

  if (isLoading) {
    return <div className="p-8 text-center">Loading orders...</div>
  }

  if (orders.length === 0) {
    return <div className="p-8 text-center">No orders found</div>
  }

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id.substring(0, 8)}</TableCell>
              <TableCell>{order.customer_name}</TableCell>
              <TableCell>{order.created_at ? format(new Date(order.created_at), "MMM dd, yyyy") : "N/A"}</TableCell>
              <TableCell>
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
                    <Clock className="h-3.5 w-3.5" />
                  ) : (
                    <X className="h-3.5 w-3.5" />
                  )}
                  <span className="capitalize">{order.status}</span>
                </Badge>
              </TableCell>
              <TableCell className="text-right">{Number(order.total).toLocaleString("fr-MA")} د.م.</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
