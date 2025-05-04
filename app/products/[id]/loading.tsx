export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-[3/4] bg-stone-200 animate-pulse"></div>

        <div className="space-y-6">
          <div className="h-8 bg-stone-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-6 bg-stone-200 rounded w-1/4 animate-pulse"></div>

          <div className="space-y-2">
            <div className="h-4 bg-stone-200 rounded w-1/3 animate-pulse"></div>
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 w-10 bg-stone-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>

          <div className="h-12 bg-stone-200 rounded w-full animate-pulse"></div>

          <div className="h-32 bg-stone-200 rounded w-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
