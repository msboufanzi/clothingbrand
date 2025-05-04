"use client"

import Link from "next/link"
import { X } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect } from "react"

export function Cart({ onClose }: { onClose?: () => void }) {
  const { items, removeFromCart, updateQuantity, subtotal, getItemKey } = useCart()

  // Debug: Log cart items when they change
  useEffect(() => {
    console.log("Current cart items:", items)
  }, [items])

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
        <p className="text-sm text-gray-500 mb-4">Looks like you haven't added any products to your cart yet.</p>
        <Button onClick={onClose} variant="outline">
          Continue Shopping
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {items.map((item) => {
            const itemKey = getItemKey(item)

            return (
              <div key={itemKey} className="flex gap-3 py-3 border-b">
                <div className="w-16 flex-shrink-0 relative">
                  {item.image_url && (
                    <div className="relative h-16 w-16 bg-gray-100 rounded">
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.name}
                        className="object-cover w-full h-full rounded"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <Link href={`/products/${item.id}`} className="font-medium text-sm hover:underline line-clamp-1">
                      {item.name}
                    </Link>
                    <button
                      onClick={() => {
                        removeFromCart(itemKey)
                      }}
                      className="text-gray-400 hover:text-gray-500 ml-1 flex-shrink-0"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Display variant information more prominently */}
                  {item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0 && (
                    <div className="mt-1 mb-1 flex flex-wrap gap-1">
                      {Object.entries(item.selectedAttributes)
                        .filter(([_, attr]) => attr !== null)
                        .map(([type, attr]: [string, any]) => (
                          <span key={type} className="inline-block px-1.5 py-0.5 bg-gray-100 text-xs rounded">
                            {type.charAt(0).toUpperCase() + type.slice(1)}: {attr?.label || attr?.value || ""}
                          </span>
                        ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center border rounded">
                      <button
                        type="button"
                        className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800"
                        onClick={() => updateQuantity(itemKey, Math.max(1, item.quantity - 1))}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-2 py-1 text-xs text-center w-6">{item.quantity}</span>
                      <button
                        type="button"
                        className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800"
                        onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-medium text-sm">{formatCurrency(item.price * item.quantity)}</p>
                  </div>

                  {/* Display unit price */}
                  {item.quantity > 1 && (
                    <p className="text-xs text-gray-500 text-right mt-0.5">{formatCurrency(item.price)} each</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
      <div className="border-t p-4 space-y-4">
        <div className="flex justify-between text-base font-medium">
          <p>Subtotal</p>
          <p>{formatCurrency(subtotal)}</p>
        </div>
        <div className="space-y-2">
          <Button asChild className="w-full">
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full">
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  )
}
