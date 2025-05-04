"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { ArrowLeft, Mail, Phone, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { useToast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { sendEmail } from "@/lib/email"

export default function CustomerDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [customer, setCustomer] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [isSending, setIsSending] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchCustomerData() {
      try {
        setIsLoading(true)
        setError(null)

        // Get customer details
        const { data: customerData, error: customerError } = await supabase
          .from("customers")
          .select("*")
          .eq("id", id)
          .single()

        if (customerError) {
          setError("Customer not found")
          return
        }

        setCustomer(customerData)

        // Get customer orders
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .eq("customer_email", customerData.email)
          .order("created_at", { ascending: false })

        if (ordersError) {
          console.error("Error fetching orders:", ordersError)
        } else {
          setOrders(ordersData || [])
        }
      } catch (error) {
        console.error("Error fetching customer data:", error)
        setError("Failed to load customer details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomerData()
  }, [id, supabase])

  const handleDeleteCustomer = async () => {
    try {
      // Delete customer
      const { error } = await supabase.from("customers").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Customer deleted",
        description: "The customer has been deleted successfully",
      })

      router.push("/admin/customers")
    } catch (error) {
      console.error("Error deleting customer:", error)
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
    }
  }

  const handleSendEmail = async () => {
    if (!customer || !emailSubject || !emailBody) return

    setIsSending(true)

    try {
      await sendEmail({
        to: customer.email,
        subject: emailSubject,
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="text-align: center; color: #333;">${emailSubject}</h1>
            <div style="white-space: pre-line;">${emailBody}</div>
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #777; font-size: 12px;">
              <p>Echaly Fashion | 123 Fashion Avenue, Marrakech, Morocco | info@echaly.com</p>
            </div>
          </div>
        `,
      })

      toast({
        title: "Email sent",
        description: `Email has been sent to ${customer.email}`,
      })

      setEmailSubject("")
      setEmailBody("")
      setIsEmailDialogOpen(false)
    } catch (error) {
      console.error("Error sending email:", error)
      toast({
        title: "Error",
        description: "Failed to send email",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
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
              <p>Loading customer details...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="flex min-h-screen bg-stone-50">
        <AdminSidebar />
        <div className="flex-1">
          <AdminHeader />
          <main className="p-6">
            <Button asChild variant="ghost" className="mb-8">
              <Link href="/admin/customers" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Customers
              </Link>
            </Button>
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
              <h2 className="text-lg font-medium mb-2">Error</h2>
              <p>{error || "Failed to load customer details"}</p>
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
                <Link href="/admin/customers" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Customers
                </Link>
              </Button>
              <h1 className="text-3xl font-light">
                {customer.first_name} {customer.last_name}
              </h1>
              <p className="text-gray-600">
                Customer since {customer.created_at ? format(new Date(customer.created_at), "MMMM yyyy") : "N/A"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEmailDialogOpen(true)}>
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                <Trash className="h-4 w-4 mr-2" />
                Delete Customer
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>Personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">
                      {customer.first_name} {customer.last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{customer.email}</p>
                  </div>
                </div>
                {customer.phone && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{customer.phone}</p>
                      <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                        <a href={`tel:${customer.phone}`}>
                          <Phone className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
                {customer.address && (
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">
                      {customer.address}
                      {customer.city && customer.postal_code && (
                        <>
                          <br />
                          {customer.city}, {customer.postal_code}
                        </>
                      )}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Purchase Summary</CardTitle>
                <CardDescription>Customer's order history and spending</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <p className="text-2xl font-bold">{orders.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Spent</p>
                    <p className="text-2xl font-bold">{customer.total_spent?.toLocaleString("fr-MA")} د.م.</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Order</p>
                  <p className="font-medium">
                    {orders.length > 0 ? format(new Date(orders[0].created_at), "MMMM dd, yyyy") : "No orders yet"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>All orders placed by this customer</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">This customer hasn't placed any orders yet.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id.substring(0, 8)}</TableCell>
                        <TableCell>
                          {order.created_at ? format(new Date(order.created_at), "MMM dd, yyyy") : "N/A"}
                        </TableCell>
                        <TableCell>
                          <span className="capitalize">{order.status}</span>
                        </TableCell>
                        <TableCell>{order.total.toLocaleString("fr-MA")} د.م.</TableCell>
                        <TableCell className="text-right">
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/admin/orders/${order.id}`}>View Details</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCustomer}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Email Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Email to Customer</DialogTitle>
            <DialogDescription>
              Send a personalized email to {customer?.first_name} {customer?.last_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <input
                id="subject"
                className="w-full p-2 border rounded-md"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="body" className="text-sm font-medium">
                Message
              </label>
              <textarea
                id="body"
                className="w-full p-2 border rounded-md min-h-[150px]"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail} disabled={isSending || !emailSubject || !emailBody}>
              {isSending ? "Sending..." : "Send Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
