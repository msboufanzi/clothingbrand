"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Mail, MoreHorizontal, Phone, Trash } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
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
import { getCustomers, type Customer } from "@/lib/database"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const data = await getCustomers()
        setCustomers(data)
      } catch (error) {
        console.error("Error fetching customers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  const handleDeleteCustomer = async (customerId: string) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      try {
        const { error } = await supabase.from("customers").delete().eq("id", customerId)

        if (error) throw error

        setCustomers((prev) => prev.filter((customer) => customer.id !== customerId))

        toast({
          title: "Customer deleted",
          description: "The customer has been deleted successfully.",
        })
      } catch (error) {
        console.error("Error deleting customer:", error)
        toast({
          title: "Error",
          description: "Failed to delete customer. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />

      <div className="flex-1">
        <AdminHeader />

        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-light">Customers</h1>
            <p className="text-gray-600">Manage your customer database</p>
          </div>

          <div className="bg-white rounded-md border">
            {isLoading ? (
              <div className="p-8 text-center">Loading customers...</div>
            ) : customers.length === 0 ? (
              <div className="p-8 text-center">No customers found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        {customer.first_name} {customer.last_name}
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.orders_count}</TableCell>
                      <TableCell>{customer.total_spent.toLocaleString("fr-MA")} د.م.</TableCell>
                      <TableCell>
                        {customer.created_at ? format(new Date(customer.created_at), "MMM dd, yyyy") : "N/A"}
                      </TableCell>
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
                              <Link href={`/admin/customers/${customer.id}`}>View details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <a href={`mailto:${customer.email}`}>
                                <Mail className="h-4 w-4 mr-2" />
                                Send Email
                              </a>
                            </DropdownMenuItem>
                            {customer.phone && (
                              <DropdownMenuItem asChild>
                                <a href={`tel:${customer.phone}`}>
                                  <Phone className="h-4 w-4 mr-2" />
                                  Call
                                </a>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteCustomer(customer.id)}
                              className="text-red-600"
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Delete Customer
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
    </div>
  )
}
