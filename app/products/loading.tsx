export default function Loading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 mt-4 sm:mt-8">
      <div className="h-8 bg-stone-200 rounded w-1/3 mx-auto mb-12 animate-pulse"></div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] mb-3 bg-stone-200 rounded"></div>
            <div className="h-4 bg-stone-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-stone-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
