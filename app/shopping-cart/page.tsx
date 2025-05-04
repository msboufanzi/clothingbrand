"use client"

import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { X } from "lucide-react"
import { useEffect } from "react"

export default function ShoppingCartPage() {
  const { items, removeFromCart, updateQuantity, subtotal, getItemKey } = useCart()

  // Debug: Log cart items when they change
  useEffect(() => {
    console.log("Shopping cart page - Current cart items:", items)
    items.forEach((item) => {
      console.log(`Item ${item.name} key:`, getItemKey(item))
    })
  }, [items, getItemKey])

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>
        <p className="text-gray-500 mb-8">Your cart is empty</p>
        <Button asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="space-y-4">
            {items.map((item) => {
              const itemKey = getItemKey(item)
              console.log(`Rendering item ${item.name} with key:`, itemKey)

              return (
                <div key={itemKey} className="flex gap-4 p-4 border rounded-lg">
                  {/* No image - just a placeholder div for spacing */}
                  <div className="w-16 flex-shrink-0"></div>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <Link href={`/products/${item.id}`} className="font-medium hover:underline">
                        {item.name}
                      </Link>
                      <button
                        onClick={() => {
                          console.log(`Removing item with key: ${itemKey}`)
                          removeFromCart(itemKey)
                        }}
                        className="text-gray-400 hover:text-gray-500"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Display variant information more prominently */}
                    {item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0 && (
                      <div className="mt-2 mb-3">
                        {Object.entries(item.selectedAttributes)
                          .filter(([_, attr]) => attr !== null)
                          .map(([type, attr]: [string, any]) => (
                            <span key={type} className="inline-block mr-2 px-2 py-1 bg-gray-100 text-xs rounded-md">
                              {type.charAt(0).toUpperCase() + type.slice(1)}: {attr?.label || attr?.value || ""}
                            </span>
                          ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded-md">
                        <button
                          type="button"
                          className="px-3 py-1 text-gray-600 hover:text-gray-800"
                          onClick={() => updateQuantity(itemKey, Math.max(1, item.quantity - 1))}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-center w-10">{item.quantity}</span>
                        <button
                          type="button"
                          className="px-3 py-1 text-gray-600 hover:text-gray-800"
                          onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                    </div>

                    {/* Display unit price */}
                    {item.quantity > 1 && (
                      <p className="text-xs text-gray-500 text-right mt-1">{formatCurrency(item.price)} each</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
            </div>
            <Button asChild className="w-full mb-2">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
