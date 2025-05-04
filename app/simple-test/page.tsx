import { SimpleProducts } from "@/components/simple-products"

export const metadata = {
  title: "Simple Products Test",
}

export default function SimpleTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Simple Products Test</h1>
      <p className="mb-6">This page tests a simplified product loading approach.</p>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <SimpleProducts />
      </div>
    </div>
  )
}
