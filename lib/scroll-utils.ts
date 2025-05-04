/**
 * Forces the window to scroll to the top using multiple methods
 * to ensure compatibility across different browsers
 */
export function forceScrollToTop() {
  // Method 1: Standard scroll
  window.scrollTo(0, 0)

  // Method 2: Using scrollTo with options
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto", // Using "auto" instead of "smooth" for immediate effect
  })

  // Method 3: Using scroll
  window.scroll(0, 0)

  // Method 4: Using scrollBy to ensure we're at the top
  window.scrollBy(0, -window.pageYOffset)

  // Method 5: Using setTimeout as a fallback for some browsers
  setTimeout(() => {
    window.scrollTo(0, 0)
  }, 0)

  // Method 6: Set scroll on html and body elements (for older browsers)
  if (document.documentElement) {
    document.documentElement.scrollTop = 0
  }
  if (document.body) {
    document.body.scrollTop = 0
  }
}
