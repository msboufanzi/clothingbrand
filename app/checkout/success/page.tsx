"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { CheckCircle } from "lucide-react"

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const [orderDetails, setOrderDetails] = useState<{
    orderId?: string
    customerName?: string
    total?: number
    items?: number
  } | null>(null)

  useEffect(() => {
    // Get order details from session storage
    const orderId = sessionStorage.getItem("lastOrderId")
    const detailsStr = sessionStorage.getItem("lastOrderDetails")

    if (orderId && detailsStr) {
      try {
        const details = JSON.parse(detailsStr)
        setOrderDetails({
          orderId,
          ...details,
        })
      } catch (e) {
        console.error("Error parsing order details:", e)
      }
    } else {
      // No order details found, redirect to home
      router.push("/")
    }
  }, [router])

  if (!orderDetails) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading order details...</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <div className="text-center mb-8">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>

        <div className="border-t border-b py-4 my-6">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Order Number:</span>
            <span>{orderDetails.orderId}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Customer:</span>
            <span>{orderDetails.customerName}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Items:</span>
            <span>{orderDetails.items}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Total:</span>
            <span className="font-bold">{formatCurrency(orderDetails.total || 0)}</span>
          </div>
        </div>

        <div className="text-center mb-6">
          <p className="mb-4">
            We've sent a confirmation email to your email address with all the details of your order.
          </p>
          <p className="text-sm text-gray-600">
            If you have any questions about your order, please contact our customer service.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => router.push("/products")} className="flex-1">
            Continue Shopping
          </Button>
          <Button onClick={() => router.push("/")} variant="outline" className="flex-1">
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
