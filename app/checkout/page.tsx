"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    notes: "",
  })

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare order data - only include fields that exist in the database schema
      const orderData = {
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address: formData.address,
        city: formData.city,
        postal_code: formData.zip,
        total: subtotal,
        status: "pending",
        payment_method: "cash_on_delivery",
        items: items.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          price: item.price,
          quantity: item.quantity,
          // Remove size, color, and attributes as they don't exist in the schema
        })),
      }

      console.log("Submitting order:", JSON.stringify(orderData))

      // Send order to API
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const responseData = await response.json()

      if (!response.ok) {
        console.error("Order creation failed:", responseData)
        throw new Error(responseData.error || "Failed to create order")
      }

      // Show success toast
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase. We'll send you a confirmation email shortly.",
      })

      // Store order ID in session storage for the success page
      sessionStorage.setItem("lastOrderId", responseData.order.id)
      sessionStorage.setItem(
        "lastOrderDetails",
        JSON.stringify({
          customerName: orderData.customer_name,
          total: orderData.total,
          items: items.length,
        }),
      )

      // Clear cart
      clearCart()

      // Redirect to success page
      router.push("/checkout/success")
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Error placing order",
        description: error instanceof Error ? error.message : "Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="mb-8">Add some products to your cart before checking out.</p>
        <Button onClick={() => router.push("/products")}>Browse Products</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="mt-1 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="mt-1 h-12"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 h-12"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="mt-1 h-12"
                />
              </div>

              <div>
                <Label htmlFor="address" className="text-sm">
                  Address
                </Label>
                <Input id="address" value={formData.address} onChange={handleChange} required className="mt-1 h-12" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city" className="text-sm">
                    City
                  </Label>
                  <Input id="city" value={formData.city} onChange={handleChange} required className="mt-1 h-12" />
                </div>
                <div>
                  <Label htmlFor="state" className="text-sm">
                    State/Province
                  </Label>
                  <Input id="state" value={formData.state} onChange={handleChange} required className="mt-1 h-12" />
                </div>
                <div>
                  <Label htmlFor="zip" className="text-sm">
                    Postal Code
                  </Label>
                  <Input id="zip" value={formData.zip} onChange={handleChange} required className="mt-1 h-12" />
                </div>
              </div>

              <div>
                <Label htmlFor="country" className="text-sm">
                  Country
                </Label>
                <Input id="country" value={formData.country} onChange={handleChange} required className="mt-1 h-12" />
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm">
                  Order Notes (Optional)
                </Label>
                <Textarea id="notes" value={formData.notes} onChange={handleChange} className="mt-1" />
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full h-12 text-base" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 lg:sticky lg:top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4 mb-4">
              {items.map((item, index) => {
                return (
                  <div key={index} className="flex gap-3">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      {(item.size || item.color) && (
                        <p className="text-xs text-gray-500">
                          {item.size && `Size: ${item.size}`}
                          {item.size && item.color && ", "}
                          {item.color && `Color: ${item.color}`}
                        </p>
                      )}
                      <div className="flex justify-between mt-1">
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        <p className="font-medium text-sm">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <p className="text-sm">Subtotal</p>
                <p className="text-sm">{formatCurrency(subtotal)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm">Shipping</p>
                <p className="text-sm">Free</p>
              </div>
              <div className="flex justify-between font-bold text-base sm:text-lg">
                <p>Total</p>
                <p>{formatCurrency(subtotal)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
