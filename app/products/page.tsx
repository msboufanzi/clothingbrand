import { UniversalProductGrid } from "@/components/universal-product-grid"

export const dynamic = "force-dynamic"

export default function ProductsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  // Get the category from the URL query parameter
  const categorySlug = searchParams?.category as string | undefined

  // Get the category name for the title
  let pageTitle = "Our Dresses"
  if (categorySlug) {
    pageTitle = categorySlug.replace(/-/g, " ")
    // Capitalize first letter of each word
    pageTitle = pageTitle
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 mt-4 sm:mt-8">
      <h1 className="text-2xl sm:text-3xl font-light mb-6 sm:mb-12 text-center">{pageTitle}</h1>
      <UniversalProductGrid category={categorySlug} />
    </div>
  )
}
