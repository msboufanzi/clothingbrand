// Service Worker for Echaly
const CACHE_NAME = "echaly-cache-v1"
const OFFLINE_URL = "/offline.html"

// Assets to cache immediately on install
const PRECACHE_ASSETS = ["/", "/offline.html", "/globals.css", "/placeholder.svg"]

// Install event - precache critical assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting()),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== CACHE_NAME
            })
            .map((cacheName) => {
              return caches.delete(cacheName)
            }),
        )
      })
      .then(() => self.clients.claim()),
  )
})

// Fetch event - network first, fallback to cache, then offline page
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return

  // Skip browser extensions and analytics
  const url = new URL(event.request.url)
  if (!url.origin.includes(self.location.origin) || url.pathname.startsWith("/api/")) return

  // Handle the fetch with a network-first strategy
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response && response.status === 200) {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
        }
        return response
      })
      .catch(() => {
        // Try to get from cache if network fails
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }
          // Return offline page for navigation requests
          if (event.request.mode === "navigate") {
            return caches.match(OFFLINE_URL)
          }
          return null
        })
      }),
  )
})

// Background sync for offline form submissions
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-forms") {
    event.waitUntil(syncForms())
  }
})

// Function to sync stored form data
async function syncForms() {
  const db = await openDB()
  const forms = await db.getAll("forms")

  for (const form of forms) {
    try {
      const response = await fetch(form.url, {
        method: form.method,
        headers: form.headers,
        body: form.body,
      })

      if (response.ok) {
        await db.delete("forms", form.id)
      }
    } catch (error) {
      console.error("Sync failed:", error)
    }
  }
}

// IndexedDB helper
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("echaly-offline", 1)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      db.createObjectStore("forms", { keyPath: "id", autoIncrement: true })
    }

    request.onsuccess = (event) => resolve(event.target.result)
    request.onerror = (event) => reject(event.target.error)
  })
}
