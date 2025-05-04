import { CustomLink } from "@/components/custom-link"
import { Instagram } from "lucide-react"

import { Button } from "@/components/ui/button"

export function SiteFooter() {
  return (
    <footer className="bg-stone-50 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-8">
          <div className="col-span-2 md:col-span-1">
            <CustomLink href="/" className="text-2xl font-light tracking-wider mb-4 inline-block">
              ECHALY
            </CustomLink>
            <p className="text-gray-600 mb-6">Elegant fashion for the modern woman.</p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" asChild>
                <a href="https://www.instagram.com/echalyfashion/" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </a>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">Shop</h3>
            <ul className="space-y-3">
              <li>
                <CustomLink href="/products" className="text-gray-600 hover:text-black text-sm">
                  All Products
                </CustomLink>
              </li>
              <li>
                <CustomLink href="/products?category=dresses" className="text-gray-600 hover:text-black text-sm">
                  Dresses
                </CustomLink>
              </li>
              <li>
                <CustomLink href="/products?category=evening-wear" className="text-gray-600 hover:text-black text-sm">
                  Evening Wear
                </CustomLink>
              </li>
              <li>
                <CustomLink href="/products?category=casual" className="text-gray-600 hover:text-black text-sm">
                  Casual Collection
                </CustomLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <CustomLink href="/about" className="text-gray-600 hover:text-black text-sm">
                  About Us
                </CustomLink>
              </li>
              <li>
                <CustomLink href="/contact" className="text-gray-600 hover:text-black text-sm">
                  Contact
                </CustomLink>
              </li>
              <li>
                <CustomLink href="/privacy" className="text-gray-600 hover:text-black text-sm">
                  Privacy Policy
                </CustomLink>
              </li>
              <li>
                <CustomLink href="/terms" className="text-gray-600 hover:text-black text-sm">
                  Terms of Service
                </CustomLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <CustomLink href="/shipping" className="text-gray-600 hover:text-black text-sm">
                  Shipping Policy
                </CustomLink>
              </li>
              <li>
                <CustomLink href="/returns" className="text-gray-600 hover:text-black text-sm">
                  Returns & Refunds
                </CustomLink>
              </li>
              <li>
                <CustomLink href="/faq" className="text-gray-600 hover:text-black text-sm">
                  FAQ
                </CustomLink>
              </li>
              <li>
                <CustomLink href="/size-guide" className="text-gray-600 hover:text-black text-sm">
                  Size Guide
                </CustomLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Echaly. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
