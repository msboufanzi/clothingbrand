"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Check, Clock, MoreHorizontal, Trash, Truck, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { getOrders, updateOrderStatus, deleteOrder, type Order } from "@/lib/database"
import { sendEmail, generateOrderConfirmationEmail } from "@/lib/email"
import { useToast } from "@/components/ui/use-toast"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getOrders()
        setOrders(data)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handleStatusChange = async (orderId: string, status: Order["status"]) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, status)
      if (updatedOrder) {
        setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)))

        // Send email notification if status changed to delivered
        if (status === "delivered") {
          const order = orders.find((o) => o.id === orderId)
          if (order) {
            const { subject, body } = generateOrderConfirmationEmail({
              id: order.id,
              customer_name: order.customer_name,
              total: order.total,
              items: order.items,
            })

            await sendEmail({
              to: order.customer_email,
              subject,
              body,
            })
          }
        }
      }
    } catch (error) {
      console.error(`Error updating order ${orderId}:`, error)
    }
  }

  const handleDeleteClick = (order: Order) => {
    setSelectedOrder(order)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedOrder) return

    try {
      const success = await deleteOrder(selectedOrder.id)
      if (success) {
        setOrders((prev) => prev.filter((o) => o.id !== selectedOrder.id))
        toast({
          title: "Order deleted",
          description: `Order #${selectedOrder.id} has been deleted successfully.`,
        })
      } else {
        throw new Error("Failed to delete order")
      }
    } catch (error) {
      console.error(`Error deleting order ${selectedOrder.id}:`, error)
      toast({
        title: "Error",
        description: "Failed to delete order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setSelectedOrder(null)
    }
  }

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />

      <div className="flex-1">
        <AdminHeader />

        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-light">Orders</h1>
            <p className="text-gray-600">Manage customer orders</p>
          </div>

          <div className="bg-white rounded-md border">
            {isLoading ? (
              <div className="p-8 text-center">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center">No orders found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer_name}</TableCell>
                      <TableCell>
                        {order.created_at ? format(new Date(order.created_at), "MMM dd, yyyy") : "N/A"}
                      </TableCell>
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
                            <Truck className="h-3.5 w-3.5" />
                          ) : (
                            <X className="h-3.5 w-3.5" />
                          )}
                          <span className="capitalize">{order.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>{order.total.toLocaleString("fr-MA")} د.م.</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <a href={`/admin/orders/${order.id}`}>View details</a>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, "pending")}>
                              Mark as Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, "processing")}>
                              Mark as Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, "delivered")}>
                              Mark as Delivered
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, "cancelled")}>
                              Mark as Cancelled
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteClick(order)} className="text-red-600">
                              <Trash className="h-4 w-4 mr-2" />
                              Delete Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete order #{selectedOrder?.id}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
