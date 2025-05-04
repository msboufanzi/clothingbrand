import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-light text-center mb-8">Our Story</h1>

        <div className="relative aspect-video mb-12">
          <Image
            src="/images/about-echaly.jpeg"
            alt="Echaly fashion experience with luxury shopping"
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <p>
            Founded in 2020, Echaly was born from a passion for elegant design and a commitment to celebrating the
            beauty of Moroccan craftsmanship. Our founder, inspired by the rich textile heritage of Morocco and
            contemporary global fashion, set out to create a brand that would bridge traditional artisanal techniques
            with modern aesthetics.
          </p>

          <p>
            The name "Echaly" draws inspiration from the Arabic word for "my elegance," reflecting our dedication to
            helping women express their unique style through thoughtfully designed clothing. Each piece in our
            collection is created with attention to detail, quality materials, and a focus on timeless design that
            transcends seasonal trends.
          </p>

          <p>
            At Echaly, we believe that true elegance comes from the perfect balance of comfort and style. Our designs
            are created to make women feel confident and beautiful, with silhouettes that flatter and fabrics that feel
            luxurious against the skin.
          </p>

          <h2 className="text-2xl font-light mt-8 mb-4">Our Values</h2>

          <p>
            <strong>Quality Craftsmanship:</strong> Each Echaly piece is meticulously crafted by skilled artisans who
            take pride in their work. We believe in creating garments that are made to last, both in style and
            durability.
          </p>

          <p>
            <strong>Ethical Production:</strong> We are committed to ethical manufacturing practices and fair wages for
            all the talented individuals who bring our designs to life. By producing locally in Morocco, we support our
            community while reducing our environmental footprint.
          </p>

          <p>
            <strong>Timeless Design:</strong> In a world of fast fashion, we stand for thoughtful design that endures.
            Our collections are created to be versatile, allowing each piece to be styled in multiple ways and worn for
            years to come.
          </p>

          <p>
            <strong>Customer Connection:</strong> We value the relationship we build with each customer. Your
            satisfaction is our priority, and we strive to provide not just beautiful clothing, but an exceptional
            shopping experience.
          </p>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-light mb-6">Join Our Journey</h2>
          <p className="text-gray-600 mb-8">
            We invite you to be part of the Echaly story. Explore our collections and discover pieces that speak to your
            personal style and values.
          </p>
          <Button asChild size="lg">
            <Link href="/products">Shop Our Collection</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
