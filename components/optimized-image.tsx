"use client"

import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"

type OptimizedImageProps = Omit<ImageProps, "onLoad" | "onError"> & {
  fallbackSrc?: string
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc = "/placeholder.svg",
  className,
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Reset loading state when src changes
    setIsLoading(true)
    setImgSrc(typeof src === "string" ? src : fallbackSrc)
  }, [src, fallbackSrc])

  return (
    <>
      {isLoading && (
        <div className={`absolute inset-0 bg-stone-100 animate-pulse ${className || ""}`} aria-hidden="true" />
      )}
      <Image
        {...props}
        src={imgSrc || fallbackSrc}
        alt={alt}
        className={`${className || ""} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImgSrc(fallbackSrc)
          setIsLoading(false)
        }}
        loading="lazy"
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFdQIoFzfUgwAAAABJRU5ErkJggg=="
      />
    </>
  )
}
