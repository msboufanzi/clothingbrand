// Memoization cache for expensive operations
const memoCache = new Map<string, any>()

export function formatCurrency(amount: number) {
  // Handle undefined or NaN values
  if (amount === undefined || amount === null || isNaN(amount)) {
    return "0 د.م."
  }

  // Use memoization for currency formatting
  const cacheKey = `currency_${amount}`
  if (memoCache.has(cacheKey)) {
    return memoCache.get(cacheKey)
  }

  try {
    // Use a more efficient approach for formatting
    const formatted = `${amount.toLocaleString("fr-MA")} د.م.`
    memoCache.set(cacheKey, formatted)
    return formatted
  } catch (error) {
    // Fallback if toLocaleString fails
    const formatted = `${amount} د.م.`
    memoCache.set(cacheKey, formatted)
    return formatted
  }
}

export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}

// Add a utility function to optimize images
export function getOptimizedImageUrl(url: string, width = 800) {
  if (!url) return "/placeholder.svg"

  // If it's already an optimized URL, return it
  if (url.includes("?quality=")) return url

  // Add quality parameter for optimization
  return `${url}?quality=80&width=${width}&format=webp`
}

// Debounce function to limit function calls
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function to limit function calls
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Function to preload images
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}
