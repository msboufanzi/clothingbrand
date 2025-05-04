"use client"

import { useEffect } from "react"

export function ImageOptimizer() {
  useEffect(() => {
    // Function to preload critical images
    const preloadCriticalImages = () => {
      // Get all images in the viewport
      const images = document.querySelectorAll('img[loading="eager"]')

      // Preload each image
      images.forEach((img) => {
        const src = img.getAttribute("src")
        if (src) {
          const preloadLink = document.createElement("link")
          preloadLink.rel = "preload"
          preloadLink.as = "image"
          preloadLink.href = src
          document.head.appendChild(preloadLink)
        }
      })
    }

    // Function to lazy load images as they come into view
    const setupLazyLoading = () => {
      if ("IntersectionObserver" in window) {
        const imageObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const img = entry.target as HTMLImageElement
                const dataSrc = img.getAttribute("data-src")

                if (dataSrc) {
                  img.src = dataSrc
                  img.removeAttribute("data-src")
                }

                imageObserver.unobserve(img)
              }
            })
          },
          {
            rootMargin: "50px 0px",
            threshold: 0.01,
          },
        )

        // Observe all images with data-src attribute
        document.querySelectorAll("img[data-src]").forEach((img) => {
          imageObserver.observe(img)
        })
      } else {
        // Fallback for browsers that don't support IntersectionObserver
        document.querySelectorAll("img[data-src]").forEach((img) => {
          const dataSrc = img.getAttribute("data-src")
          if (dataSrc) {
            img.setAttribute("src", dataSrc)
            img.removeAttribute("data-src")
          }
        })
      }
    }

    // Fix for iOS Safari height issues
    const fixIOSHeight = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty("--vh", `${vh}px`)
    }

    // Fix for iOS Safari scrolling issues
    const fixIOSScrolling = () => {
      document.documentElement.style.setProperty("overflow-x", "hidden")
      document.body.style.setProperty("overflow-x", "hidden")
      document.body.style.setProperty("-webkit-overflow-scrolling", "touch")
    }

    // Run optimizations
    preloadCriticalImages()
    setupLazyLoading()
    fixIOSHeight()
    fixIOSScrolling()

    window.addEventListener("resize", fixIOSHeight, { passive: true })

    return () => {
      window.removeEventListener("resize", fixIOSHeight)
    }
  }, [])

  return null
}
