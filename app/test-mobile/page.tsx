import { FeaturedProducts } from "@/components/featured-products"

export default function TestMobilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Mobile Test Page</h1>
      <p className="text-center mb-8">This page tests product loading on mobile devices.</p>

      <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
      <FeaturedProducts />
    </div>
  )
}
