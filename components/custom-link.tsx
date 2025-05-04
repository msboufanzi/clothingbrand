"use client"

import type React from "react"

import Link from "next/link"
import { forwardRef } from "react"

interface CustomLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  children: React.ReactNode
  className?: string
}

const CustomLink = forwardRef<HTMLAnchorElement, CustomLinkProps>(({ href, children, className, ...props }, ref) => {
  return (
    <Link
      href={href}
      ref={ref}
      className={className}
      scroll={true} // Ensure scrolling to top
      {...props}
    >
      {children}
    </Link>
  )
})

CustomLink.displayName = "CustomLink"

export { CustomLink }
