"use client"

import { useState, useEffect, useCallback } from "react"
import { CustomLink } from "@/components/custom-link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Menu, Search, ShoppingBag, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Our Dresses", href: "/products" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const {
    items: cartItems,
    removeFromCart,
    clearCart,
    totalItems,
    subtotal,
    isOpen,
    openCart,
    closeCart,
    toggleCart,
    continueShopping,
  } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Memoize the scroll handler to prevent unnecessary re-renders
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10)
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  const handleCheckout = () => {
    if (closeCart) {
      closeCart()
    }
    router.push("/checkout")
  }

  const handleContinueShopping = () => {
    continueShopping?.()
    router.push("/products")
  }

  const handleMobileNavClick = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-sm" : "bg-white bg-opacity-90 shadow-sm"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="text-left">Navigation Menu</SheetTitle>
              <div className="flex flex-col gap-6 mt-8">
                <CustomLink href="/" className="text-2xl font-light tracking-wider mb-4" onClick={handleMobileNavClick}>
                  ECHALY
                </CustomLink>
                {navigation.map((item) => (
                  <CustomLink
                    key={item.name}
                    href={item.href}
                    className="text-lg font-light hover:text-gray-600 py-2"
                    onClick={handleMobileNavClick}
                  >
                    {item.name}
                  </CustomLink>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <div className="flex-1 flex items-center justify-center md:justify-start">
            <CustomLink href="/" className="text-2xl font-light tracking-wider">
              ECHALY
            </CustomLink>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:gap-x-8">
            {navigation.map((item) => (
              <CustomLink
                key={item.name}
                href={item.href}
                className={`text-sm font-light ${
                  pathname === item.href ? "text-black" : "text-gray-600 hover:text-black"
                }`}
              >
                {item.name}
              </CustomLink>
            ))}
          </div>

          {/* Search and cart */}
          <div className="flex items-center gap-4">
            {showSearch ? (
              <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                  <div className="flex items-center mb-6">
                    <Input
                      type="search"
                      placeholder="Search for products..."
                      className="flex-grow h-12 text-base"
                      autoFocus
                    />
                    <Button variant="ghost" size="icon" onClick={() => setShowSearch(false)} className="ml-2 h-12 w-12">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="text-sm text-gray-500">Press ESC to close</div>
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(true)}
                className="text-gray-600 hover:text-black"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            )}

            <Sheet open={isOpen} onOpenChange={toggleCart}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-black h-12 w-12">
                  <ShoppingBag className="h-5 w-5" />
                  {(totalItems ?? 0) > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                  <span className="sr-only">Open cart</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <SheetTitle>Shopping Cart</SheetTitle>
                <CartContent
                  cartItems={cartItems}
                  removeFromCart={removeFromCart}
                  clearCart={clearCart}
                  subtotal={subtotal}
                  onCheckout={handleCheckout}
                  onContinueShopping={handleContinueShopping}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  )
}

function CartContent({
  cartItems,
  removeFromCart,
  clearCart,
  subtotal,
  onCheckout,
  onContinueShopping,
}: {
  cartItems: any[]
  removeFromCart: (id: string) => void
  clearCart: () => void
  subtotal: number
  onCheckout: () => void
  onContinueShopping: () => void
}) {
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <ShoppingBag className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-light mb-2">Your cart is empty</h3>
        <p className="text-gray-500 text-center mb-6">Looks like you haven't added any items to your cart yet.</p>
        <Button onClick={onContinueShopping}>Continue Shopping</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-4 py-4 border-b">
            <div className="relative w-20 h-24 bg-stone-100">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-light">{item.name}</h3>
              <p className="text-gray-600 text-sm">{formatCurrency(Number(item.price))}</p>
              {item.size && <p className="text-gray-500 text-xs">Size: {item.size.toUpperCase()}</p>}
              {item.quantity && <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>}
            </div>
            <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.id)} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6 border-t">
        <div className="flex justify-between mb-4">
          <span>Subtotal</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        <div className="grid gap-3">
          <Button onClick={onCheckout}>Checkout</Button>
          <Button variant="outline" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
