"use client"

import { useEffect } from "react"

export function ScriptOptimizer() {
  useEffect(() => {
    // Function to defer non-critical JavaScript
    const deferNonCriticalJS = () => {
      // Wait until the page is fully loaded
      if (document.readyState === "complete") {
        // Find all script tags with data-defer attribute
        const scripts = document.querySelectorAll('script[data-defer="true"]')

        // Load each script after a delay
        scripts.forEach((script, index) => {
          setTimeout(
            () => {
              const newScript = document.createElement("script")
              if (script.src) {
                newScript.src = script.src
              } else {
                newScript.textContent = script.textContent
              }

              // Copy all attributes except data-defer
              Array.from(script.attributes).forEach((attr) => {
                if (attr.name !== "data-defer") {
                  newScript.setAttribute(attr.name, attr.value)
                }
              })

              // Replace the original script with the new one
              script.parentNode?.replaceChild(newScript, script)
            },
            1000 + index * 200,
          ) // Stagger loading to avoid blocking main thread
        })
      }
    }

    // Add event listener for page load
    if (document.readyState === "complete") {
      deferNonCriticalJS()
    } else {
      window.addEventListener("load", deferNonCriticalJS)
    }

    // Clean up
    return () => {
      window.removeEventListener("load", deferNonCriticalJS)
    }
  }, [])

  return null
}
