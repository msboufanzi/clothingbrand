import { ProductGrid } from "@/components/product-grid"
import { FeaturedProducts } from "@/components/featured-products"

export default function TestProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Product Test Page</h1>
      <p className="text-center mb-8">This page tests product loading on all devices.</p>

      <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
      <div className="mb-8">
        <FeaturedProducts />
      </div>

      <h2 className="text-xl font-semibold mb-4">All Products</h2>
      <ProductGrid />
    </div>
  )
}
