import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export default async function DebugProductsPage() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  // Fetch products directly
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, price, images, category")
    .order("created_at", { ascending: false })

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Database Error</h1>
        <pre className="bg-red-100 p-4 rounded overflow-auto">{JSON.stringify(error, null, 2)}</pre>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Database Products Check</h1>
      <p className="mb-4">Total products found: {products.length}</p>

      <div className="overflow-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Images</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="border p-2">{product.id}</td>
                <td className="border p-2">{product.name}</td>
                <td className="border p-2">${product.price}</td>
                <td className="border p-2">{product.category}</td>
                <td className="border p-2">
                  {product.images && Array.isArray(product.images) ? `${product.images.length} images` : "No images"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
