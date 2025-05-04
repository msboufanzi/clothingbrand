"use client"

import { useState } from "react"
import { Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { ProductSize, ProductColor } from "@/lib/database"

interface ProductAttributesProps {
  sizes: ProductSize[]
  setSizes: (sizes: ProductSize[]) => void
  colors: ProductColor[]
  setColors: (colors: ProductColor[]) => void
  defaultSize: string
  setDefaultSize: (size: string) => void
  defaultColor: string
  setDefaultColor: (color: string) => void
  hasSizes: boolean
  setHasSizes: (hasSizes: boolean) => void
  hasColors: boolean
  setHasColors: (hasColors: boolean) => void
  stockPerVariant: Record<string, number>
  setStockPerVariant: (stockPerVariant: Record<string, number>) => void
}

export function ProductAttributes({
  sizes,
  setSizes,
  colors,
  setColors,
  defaultSize,
  setDefaultSize,
  defaultColor,
  setDefaultColor,
  hasSizes,
  setHasSizes,
  hasColors,
  setHasColors,
  stockPerVariant,
  setStockPerVariant,
}: ProductAttributesProps) {
  const [newSize, setNewSize] = useState("")
  const [newColor, setNewColor] = useState({ name: "", color: "#000000" })
  const { toast } = useToast()

  // Size management
  const addSize = () => {
    if (!newSize.trim()) return

    const sizeValue = newSize.trim()
    const sizeLabel = newSize.trim()

    // Check if size already exists
    if (sizes.some((s) => s.value === sizeValue)) {
      toast({
        title: "Size already exists",
        description: `The size "${sizeValue}" already exists.`,
        variant: "destructive",
      })
      return
    }

    const updatedSizes = [...sizes, { value: sizeValue, label: sizeLabel, inStock: true }]
    setSizes(updatedSizes)
    setNewSize("")

    // Update stock variants
    if (hasColors && colors.length > 0) {
      const updatedStock = { ...stockPerVariant }
      colors.forEach((color) => {
        updatedStock[`${sizeValue}-${color.value}`] = 0
      })
      setStockPerVariant(updatedStock)
    }

    // Set as default if it's the first size
    if (updatedSizes.length === 1) {
      setDefaultSize(sizeValue)
    }
  }

  const removeSize = (value: string) => {
    setSizes(sizes.filter((s) => s.value !== value))

    // Remove stock variants for this size
    const updatedStock = { ...stockPerVariant }
    Object.keys(updatedStock).forEach((key) => {
      if (key.startsWith(`${value}-`)) {
        delete updatedStock[key]
      }
    })
    setStockPerVariant(updatedStock)

    // Update default size if needed
    if (defaultSize === value && sizes.length > 1) {
      setDefaultSize(sizes.find((s) => s.value !== value)?.value || "")
    }
  }

  // Color management
  const addColor = () => {
    if (!newColor.name.trim()) return

    const colorValue = newColor.name.toLowerCase().trim().replace(/\s+/g, "-")
    const colorLabel = newColor.name.trim()

    // Check if color already exists
    if (colors.some((c) => c.value === colorValue)) {
      toast({
        title: "Color already exists",
        description: `The color "${colorLabel}" already exists.`,
        variant: "destructive",
      })
      return
    }

    const updatedColors = [
      ...colors,
      {
        value: colorValue,
        label: colorLabel,
        colorCode: newColor.color,
        inStock: true,
      },
    ]
    setColors(updatedColors)
    setNewColor({ name: "", color: "#000000" })

    // Update stock variants
    if (hasSizes && sizes.length > 0) {
      const updatedStock = { ...stockPerVariant }
      sizes.forEach((size) => {
        updatedStock[`${size.value}-${colorValue}`] = 0
      })
      setStockPerVariant(updatedStock)
    }

    // Set as default if it's the first color
    if (updatedColors.length === 1) {
      setDefaultColor(colorValue)
    }
  }

  const removeColor = (value: string) => {
    setColors(colors.filter((c) => c.value !== value))

    // Remove stock variants for this color
    const updatedStock = { ...stockPerVariant }
    Object.keys(updatedStock).forEach((key) => {
      if (key.endsWith(`-${value}`)) {
        delete updatedStock[key]
      }
    })
    setStockPerVariant(updatedStock)

    // Update default color if needed
    if (defaultColor === value && colors.length > 1) {
      setDefaultColor(colors.find((c) => c.value !== value)?.value || "")
    }
  }

  const handleVariantStockChange = (variant: string, value: number) => {
    setStockPerVariant((prev) => ({
      ...prev,
      [variant]: value,
    }))
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Product Options</h3>

      {/* Sizes Option */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="has-sizes" className="text-base">
            Add Sizes?
          </Label>
          <Switch id="has-sizes" checked={hasSizes} onCheckedChange={setHasSizes} />
        </div>

        {hasSizes && (
          <div className="border rounded-md p-4 space-y-4">
            <div className="flex gap-2">
              <Input
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder="Enter size (e.g., S, M, L)"
                className="flex-1"
              />
              <Button type="button" onClick={addSize} disabled={!newSize.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Size
              </Button>
            </div>

            {sizes.length > 0 && (
              <div>
                <Label className="mb-2 block">Default Size</Label>
                <RadioGroup value={defaultSize} onValueChange={setDefaultSize} className="flex flex-wrap gap-4">
                  {sizes.map((size) => (
                    <div key={size.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={size.value} id={`size-default-${size.value}`} />
                      <Label htmlFor={`size-default-${size.value}`}>{size.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {sizes.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {sizes.map((size) => (
                  <div key={size.value} className="flex items-center bg-gray-100 rounded-md px-3 py-1">
                    <span>{size.label}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-1"
                      onClick={() => removeSize(size.value)}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Colors Option */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="has-colors" className="text-base">
            Add Colors?
          </Label>
          <Switch id="has-colors" checked={hasColors} onCheckedChange={setHasColors} />
        </div>

        {hasColors && (
          <div className="border rounded-md p-4 space-y-4">
            <div className="flex gap-2">
              <div className="flex-none">
                <Input
                  type="color"
                  value={newColor.color}
                  onChange={(e) => setNewColor({ ...newColor, color: e.target.value })}
                  className="w-12 p-1 h-10"
                />
              </div>
              <Input
                value={newColor.name}
                onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                placeholder="Enter color name (e.g., Navy Blue)"
                className="flex-1"
              />
              <Button type="button" onClick={addColor} disabled={!newColor.name.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Color
              </Button>
            </div>

            {colors.length > 0 && (
              <div>
                <Label className="mb-2 block">Default Color</Label>
                <RadioGroup value={defaultColor} onValueChange={setDefaultColor} className="flex flex-wrap gap-4">
                  {colors.map((color) => (
                    <div key={color.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={color.value} id={`color-default-${color.value}`} />
                      <Label htmlFor={`color-default-${color.value}`} className="flex items-center">
                        <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color.colorCode }}></div>
                        {color.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {colors.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {colors.map((color) => (
                  <div key={color.value} className="flex items-center bg-gray-100 rounded-md px-3 py-1">
                    <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color.colorCode }}></div>
                    <span>{color.label}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-1"
                      onClick={() => removeColor(color.value)}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stock Management for Variants */}
      {hasSizes && hasColors && sizes.length > 0 && colors.length > 0 && (
        <div className="space-y-4 border rounded-md p-4">
          <h4 className="font-medium">Stock Management for Variants</h4>
          <p className="text-sm text-gray-500">Set stock quantity for each size and color combination</p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Color
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sizes.map((size) =>
                  colors.map((color) => {
                    const variantKey = `${size.value}-${color.value}`
                    return (
                      <tr key={variantKey} className="hover:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap">{size.label}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className="w-4 h-4 rounded-full mr-2"
                              style={{ backgroundColor: color.colorCode }}
                            ></div>
                            {color.label}
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <Input
                            type="number"
                            min="0"
                            value={stockPerVariant[variantKey] || 0}
                            onChange={(e) => handleVariantStockChange(variantKey, Number.parseInt(e.target.value) || 0)}
                            className="w-24"
                          />
                        </td>
                      </tr>
                    )
                  }),
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
