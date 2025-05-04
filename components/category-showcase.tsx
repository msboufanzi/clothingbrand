"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"

import { Button } from "@/components/ui/button"

// Define the Category type to fix TypeScript errors
interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
}

type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
        }
        Insert: {
          id: string
          name: string
          slug: string
          description?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
        }
      }
    }
  }
}

export function getSupabaseClient() {
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

// Default categories with real images
const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "our-dresses",
    name: "Our Dresses",
    slug: "our-dresses",
    image: "/images/our-dresses.jpeg",
    description: "Our complete collection of dresses",
  },
  {
    id: "evening-wear",
    name: "Evening Wear",
    slug: "evening-wear",
    image: "/images/evening-wear.jpeg",
    description: "Elegant dresses for special occasions",
  },
  {
    id: "new-collection",
    name: "New Collection",
    slug: "new-collection",
    image: "/images/new-collection.jpeg",
    description: "Our latest designs and styles",
  },
]

export function CategoryShowcase() {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase
          .from("categories")
          .select("id, name, slug, description")
          .order("name")
          .limit(3)

        if (error) {
          console.error("Error fetching categories:", error)
          return // Keep using default categories
        }

        if (data && data.length > 0) {
          // Map database categories but keep our custom images
          const dbCategories = (data as any[]).map((cat) => {
            // Find matching default category to get the image
            const defaultCategory = DEFAULT_CATEGORIES.find((dc) => dc.slug === cat.slug)

            return {
              id: cat.id,
              name: cat.name,
              slug: cat.slug,
              description: cat.description || "",
              // Use our custom image if available, otherwise fallback to placeholder
              image:
                defaultCategory?.image || `/placeholder.svg?height=800&width=600&text=${cat.name.replace(/\s+/g, "+")}`,
            }
          })

          setCategories(dbCategories)
        }
      } catch (error) {
        console.error("Error in category fetch:", error)
        // If there's an exception, we'll just use the default categories
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
      {categories.map((category) => (
        <div key={category.id} className="group relative overflow-hidden rounded-lg">
          <div className="relative aspect-[3/4]">
            <Image
              src={category.image || "/placeholder.svg"}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              loading="lazy"
            />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4 sm:p-6">
  <h3 className="text-white text-lg sm:text-xl font-light mb-1 sm:mb-2">{category.name}</h3>
  <p className="text-white/80 mb-3 sm:mb-4 text-xs sm:text-sm">{category.description}</p>
  <Button
    asChild
    size="sm"
    className="w-fit bg-white text-black hover:bg-white/90 !text-black"
  >
    <Link href={`/products?category=${category.slug}`}>Explore</Link>
  </Button>
</div>
          </div>
        </div>
      ))}
    </div>
  )
}
