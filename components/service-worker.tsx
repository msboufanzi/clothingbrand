"use client"

import { useEffect } from "react"

export function ServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("SW registered: ", registration)
          })
          .catch((error) => {
            console.log("SW registration failed: ", error)
          })
      })
    }
  }, [])

  return null
}
