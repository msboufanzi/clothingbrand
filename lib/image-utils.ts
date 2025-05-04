import type React from "react"
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  ;(e.target as HTMLImageElement).src = "/diverse-products-still-life.png"
}

export const getFallbackImageUrl = () => {
  return "/diverse-products-still-life.png"
}
