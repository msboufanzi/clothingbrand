"use client"

interface ProductAttributeOption {
  value: string
  label: string
  disabled?: boolean
  color?: string
}

export type ProductAttribute = {
  id: string
  value: string
  label: string
  colorCode?: string
}

interface ProductAttributeSelectorProps {
  label: string
  options: ProductAttributeOption[]
  selected: string
  onSelect: (value: string) => void
}

export function ProductAttributeSelector({ label, options, selected, onSelect }: ProductAttributeSelectorProps) {
  if (!options || options.length === 0) return null

  const isColorSelector = options.some((option) => option.color)

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`
              px-3 py-2 text-sm rounded-md border transition-colors min-w-[44px] min-h-[44px]
              ${
                selected === option.value
                  ? "border-black bg-black text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }
              ${option.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
            disabled={option.disabled}
            onClick={() => !option.disabled && onSelect(option.value)}
            style={
              option.color
                ? {
                    backgroundColor: selected === option.value ? "black" : option.color,
                    borderColor: selected === option.value ? "black" : option.color,
                    color: selected === option.value || isLightColor(option.color) ? "black" : "white",
                  }
                : {}
            }
            aria-pressed={selected === option.value}
          >
            {option.label}
            {option.disabled && <span className="ml-1 text-xs">(Out of stock)</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

// Memoize color brightness calculation for better performance
const colorBrightnessCache = new Map<string, boolean>()

function isLightColor(color: string | undefined): boolean {
  if (!color) return false

  // Check cache first
  if (colorBrightnessCache.has(color)) {
    return colorBrightnessCache.get(color) as boolean
  }

  const hexToRgb = (hex: string): [number, number, number] | null => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b)

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? [Number.parseInt(result[1], 16), Number.parseInt(result[2], 16), Number.parseInt(result[3], 16)]
      : null
  }

  const rgb = hexToRgb(color)
  if (!rgb) return false

  const [r, g, b] = rgb
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  const isLight = brightness > 128

  // Cache the result
  colorBrightnessCache.set(color, isLight)

  return isLight
}
