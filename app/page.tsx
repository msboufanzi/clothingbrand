import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FeaturedProducts } from "@/components/featured-products"
import { CategoryShowcase } from "@/components/category-showcase"
import { Newsletter } from "@/components/newsletter"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] flex items-center">
  <div className="absolute inset-0 z-0">
    {/* Replace the image with a video */}
    <video
      src="/IMG_2707.MP4"
      autoPlay
      loop
      muted
      playsInline
      className="object-cover brightness-[0.85] w-full h-full"
    ></video>
  </div>
  <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start">
    <h1 className="text-4xl md:text-6xl font-light text-white mb-4">Elegance in Every Detail</h1>
    <p className="text-lg md:text-xl text-white/90 mb-8 max-w-md">
      Discover the new collection of dresses designed for the modern woman.
    </p>
    <div className="flex flex-col sm:flex-row gap-4">
    <div className="flex flex-col sm:flex-row gap-4">
  <Button asChild variant="outline" size="lg" className="border-white text-black hover:bg-white/10">
    <Link href="/products">Shop Collection</Link>
  </Button>
  <Button asChild variant="outline" size="lg" className="border-white text-black hover:bg-white/10">
    <Link href="/about">Our Story</Link>
  </Button>
</div>
    </div>
  </div>
</section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-light text-center mb-12">Our Collections</h2>
          <CategoryShowcase />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-light">Trending Styles</h2>
            <Button asChild variant="ghost" className="group">
              <Link href="/products" className="flex items-center gap-2">
                View All
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          <FeaturedProducts />
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-light mb-6">Crafted with Love</h2>
              <p className="text-gray-600 mb-6">
                At Echaly, we believe in the power of elegant simplicity. Each piece is thoughtfully designed to enhance
                your natural beauty and confidence. Our commitment to quality ensures that every garment feels as good
                as it looks.
              </p>
              <p className="text-gray-600 mb-8">
                From selecting the finest fabrics to perfecting every stitch, we pour our passion into creating timeless
                pieces that become cherished parts of your wardrobe.
              </p>
              <Button asChild variant="outline">
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>
            <div className="relative h-[500px] w-full">
              <Image src="/gold-dress.jpeg" alt="Elegant gold evening gown" fill className="object-cover rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-stone-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Newsletter />
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-light text-center mb-8">Follow Our Journey</h2>
          <p className="text-center text-gray-600 mb-12">@echalyfashion</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                id: 1,
                image: "/images/instagram/dress-blue.jpeg",
                alt: "Ethereal blue tulle gown with floral details",
              },
              {
                id: 2,
                image: "/images/instagram/dress-red-roses.jpeg",
                alt: "Dramatic red rose-covered ball gown",
              },
              {
                id: 3,
                image: "/images/instagram/dress-burgundy.jpeg",
                alt: "Elegant burgundy metallic ball gown",
              },
              {
                id: 4,
                image: "/images/instagram/dress-pink-embroidered.jpeg",
                alt: "Blush pink gown with intricate floral embroidery",
              },
            ].map((item) => (
              <a
                key={item.id}
                href="https://www.instagram.com/echalyfashion/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square overflow-hidden group"
              >
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <ShoppingBag className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
