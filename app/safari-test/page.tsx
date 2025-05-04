import { SafariProductGrid } from "@/components/safari-product-grid"
import { SafariFeaturedProducts } from "@/components/safari-featured-products"

export default function SafariTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-light text-center mb-8">Safari Compatibility Test</h1>

      <div className="mb-12">
        <h2 className="text-2xl font-light mb-6">Featured Products</h2>
        <SafariFeaturedProducts />
      </div>

      <div>
        <h2 className="text-2xl font-light mb-6">All Products</h2>
        <SafariProductGrid />
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-medium mb-2">Debugging Information</h3>
        <p>Browser: {typeof window !== "undefined" ? window.navigator.userAgent : "Server-side rendering"}</p>
        <p>Time: {new Date().toISOString()}</p>
      </div>
    </div>
  )
}
