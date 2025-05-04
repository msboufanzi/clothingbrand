"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SeedData() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  )

  const handleSeedCustomers = async () => {
    setStatus("loading")
    setMessage("")

    try {
      // Insert sample customers
      const { error: customersError } = await supabase.from("customers").insert([
        {
          email: "sarah@example.com",
          first_name: "Sarah",
          last_name: "Ahmed",
          phone: "+212 612345678",
          address: "123 Marrakech Avenue",
          city: "Marrakech",
          postal_code: "40000",
          orders_count: 3,
          total_spent: 4500,
        },
        {
          email: "fatima@example.com",
          first_name: "Fatima",
          last_name: "Benali",
          phone: "+212 623456789",
          address: "456 Casablanca Street",
          city: "Casablanca",
          postal_code: "20000",
          orders_count: 2,
          total_spent: 3200,
        },
        {
          email: "leila@example.com",
          first_name: "Leila",
          last_name: "Mansouri",
          phone: "+212 634567890",
          address: "789 Rabat Road",
          city: "Rabat",
          postal_code: "10000",
          orders_count: 1,
          total_spent: 1800,
        },
      ])

      if (customersError) throw customersError

      // Get product IDs for creating orders
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("id, name, price")
        .limit(3)

      if (productsError) throw productsError
      if (!products || products.length === 0) throw new Error("No products found")

      // Get customer IDs
      const { data: customers, error: customersFetchError } = await supabase
        .from("customers")
        .select("id, email, first_name, last_name")
        .limit(3)

      if (customersFetchError) throw customersFetchError
      if (!customers || customers.length === 0) throw new Error("No customers found")

      // Create sample orders
      for (const customer of customers) {
        // Create order
        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert([
            {
              customer_name: `${customer.first_name} ${customer.last_name}`,
              customer_email: customer.email,
              customer_phone: "+212 6XXXXXXXX",
              shipping_address: "123 Sample Street",
              city: "Marrakech",
              postal_code: "40000",
              total: products[0].price + products[1].price,
              status: Math.random() > 0.5 ? "delivered" : "processing",
              payment_method: "cash_on_delivery",
            },
          ])
          .select()

        if (orderError) throw orderError
        if (!order || order.length === 0) throw new Error("Failed to create order")

        // Add order items
        const { error: itemsError } = await supabase.from("order_items").insert([
          {
            order_id: order[0].id,
            product_id: products[0].id,
            product_name: products[0].name,
            price: products[0].price,
            quantity: 1,
          },
          {
            order_id: order[0].id,
            product_id: products[1].id,
            product_name: products[1].name,
            price: products[1].price,
            quantity: 1,
          },
        ])

        if (itemsError) throw itemsError
      }

      setStatus("success")
      setMessage("Sample customers and orders created successfully!")
    } catch (error: any) {
      console.error("Error seeding data:", error)
      setStatus("error")
      setMessage(error.message || "Failed to seed data")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Seed Sample Data</CardTitle>
          <CardDescription>Add sample customers and orders to the database</CardDescription>
        </CardHeader>
        <CardContent>
          {status === "success" ? (
            <div className="bg-green-50 p-4 rounded-md text-green-800 mb-4">{message}</div>
          ) : status === "error" ? (
            <div className="bg-red-50 p-4 rounded-md text-red-800 mb-4">{message}</div>
          ) : null}

          <p className="mb-4">
            This will create sample customers and orders in your database to help you test the application.
          </p>

          <Button onClick={handleSeedCustomers} disabled={status === "loading"} className="w-full">
            {status === "loading" ? "Creating..." : "Create Sample Data"}
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">This page should be protected in production</p>
        </CardFooter>
      </Card>
    </div>
  )
}
