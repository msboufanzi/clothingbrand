import Image from "next/image"
import Link from "next/link"

// Static product data that will always work
const staticProducts = [
  {
    id: "static-1",
    name: "Elegant Evening Dress",
    price: 199.99,
    image: "/images/our-dresses.jpeg",
  },
  {
    id: "static-2",
    name: "Summer Collection Dress",
    price: 149.99,
    image: "/images/new-collection.jpeg",
  },
  {
    id: "static-3",
    name: "Formal Gown",
    price: 249.99,
    image: "/images/evening-wear.jpeg",
  },
  {
    id: "static-4",
    name: "Casual Day Dress",
    price: 99.99,
    image: "/gold-dress.jpeg",
  },
]

export default function StaticProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Static Products</h1>
      <p className="text-center mb-8">These products are hardcoded and will always display correctly.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {staticProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="aspect-[3/4] relative mb-2">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <h3 className="text-sm font-medium">{product.name}</h3>
            <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link href="/products" className="text-blue-600 underline">
          Back to real products
        </Link>
      </div>
    </div>
  )
}
