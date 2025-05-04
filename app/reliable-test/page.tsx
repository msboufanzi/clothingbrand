import { ReliableProducts } from "@/components/reliable-products"

export const metadata = {
  title: "Reliable Products Test",
}

export default function ReliableTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Reliable Products Test</h1>
      <p className="mb-6">This page tests a multi-layered fallback approach for product loading.</p>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <ReliableProducts />
      </div>
    </div>
  )
}
