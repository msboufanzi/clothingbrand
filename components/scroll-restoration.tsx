"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function ScrollRestoration() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname) {
      return
    }

    // Force scroll to top on route changes
    window.scrollTo(0, 0)

    // Additional approach for browsers that might need it
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "auto",
      })
    }, 0)
  }, [pathname])

  return null
}
