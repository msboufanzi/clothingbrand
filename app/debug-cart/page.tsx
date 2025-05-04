"use client"

import { useEffect, useState } from "react"
import { useCart } from "@/lib/cart-context"

export default function DebugCartPage() {
  const { items } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Debug Cart Contents</h1>

      <div className="bg-gray-100 p-4 rounded-md">
        <h2 className="text-xl font-semibold mb-2">Cart Items ({items.length})</h2>

        {items.length === 0 ? (
          <p>Cart is empty</p>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-md shadow-sm">
                <h3 className="font-medium">{item.name}</h3>
                <p>ID: {item.id}</p>
                <p>Price: {item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Image URL: {item.image_url || "No image URL"}</p>

                {item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-medium">Selected Attributes:</h4>
                    <ul className="list-disc pl-5">
                      {Object.entries(item.selectedAttributes).map(
                        ([key, attr]) =>
                          attr && (
                            <li key={key}>
                              {key}: {attr.label || attr.value}
                            </li>
                          ),
                      )}
                    </ul>
                  </div>
                )}

                <div className="mt-2">
                  <h4 className="font-medium">Image Preview:</h4>
                  {item.image_url ? (
                    <div className="mt-2 border border-gray-200 rounded-md overflow-hidden w-32 h-32">
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error(`Image failed to load: ${item.image_url}`)
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                      />
                    </div>
                  ) : (
                    <p>No image available</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Raw Cart Data</h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">{JSON.stringify(items, null, 2)}</pre>
      </div>
    </div>
  )
}
