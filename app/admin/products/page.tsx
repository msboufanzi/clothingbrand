"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Edit, Plus, Trash, Upload, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import {
  getProducts,
  createProduct,
  updateProduct,
  type Product,
  type ProductSize,
  type ProductColor,
} from "@/lib/database"
import { useToast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { ProductAttributes } from "@/components/admin/product-attributes"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Category = {
  id: string
  name: string
  slug: string
  description?: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0)
  const [newCategory, setNewCategory] = useState({ name: "", slug: "", description: "" })
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    description: "",
    category: "our-dresses", // Default category
    categories: [] as string[],
    stock: 0,
    images: [] as string[],
    details: [""],
    default_size: "",
    default_color: "",
  })

  // Product attributes state
  const [hasSizes, setHasSizes] = useState(false)
  const [hasColors, setHasColors] = useState(false)
  const [sizes, setSizes] = useState<ProductSize[]>([])
  const [colors, setColors] = useState<ProductColor[]>([])
  const [stockPerVariant, setStockPerVariant] = useState<Record<string, number>>({})

  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch products
        const productsData = await getProducts()
        setProducts(productsData)

        // Fetch categories
        try {
          const { data: categoriesData, error: categoriesError } = await supabase
            .from("categories")
            .select("*")
            .order("name")

          if (categoriesError) throw categoriesError
          setCategories(categoriesData || [])
        } catch (categoryError) {
          console.error("Error fetching categories:", categoryError)
          // Don't fail the whole page if categories can't be loaded
          setCategories([])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load data. Please refresh the page.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [supabase, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      categories: checked ? [...prev.categories, category] : prev.categories.filter((c) => c !== category),
    }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number(value) }))
  }

  const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const details = e.target.value.split("\n").filter(Boolean)
    setFormData((prev) => ({ ...prev, details }))
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/admin-upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to upload image")
    }

    const data = await response.json()
    console.log("Upload response:", data)
    return data.url
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Limit to 4 images
    const newFiles = Array.from(files).slice(0, 4 - uploadedImages.length)
    if (newFiles.length + uploadedImages.length > 4) {
      toast({
        title: "Too many images",
        description: "You can upload a maximum of 4 images per product.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    try {
      // Upload each file and get the URLs
      const uploadPromises = newFiles.map((file) => uploadImage(file))
      const newUrls = await Promise.all(uploadPromises)

      console.log("Uploaded image URLs:", newUrls)

      // Add the new files and URLs
      setUploadedImages((prev) => [...prev, ...newFiles])
      setImageUrls((prev) => [...prev, ...newUrls])

      toast({
        title: "Images uploaded",
        description: `Successfully uploaded ${newFiles.length} image(s)`,
      })
    } catch (error) {
      console.error("Error uploading images:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload images",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
    setImageUrls((prev) => {
      const newUrls = [...prev]
      newUrls.splice(index, 1)
      return newUrls
    })

    // Update primary image index if needed
    if (primaryImageIndex === index) {
      setPrimaryImageIndex(0)
    } else if (primaryImageIndex > index) {
      setPrimaryImageIndex(primaryImageIndex - 1)
    }
  }

  const handleSetPrimaryImage = (index: number) => {
    setPrimaryImageIndex(index)
  }

  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewCategory((prev) => ({ ...prev, [name]: value }))

    // Auto-generate slug from name if slug field is empty
    if (name === "name" && !newCategory.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
      setNewCategory((prev) => ({ ...prev, slug }))
    }
  }

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newCategory.name || !newCategory.slug) {
      toast({
        title: "Missing information",
        description: "Category name and slug are required.",
        variant: "destructive",
      })
      return
    }

    try {
      const { data, error } = await supabase
        .from("categories")
        .insert([
          {
            name: newCategory.name,
            slug: newCategory.slug,
            description: newCategory.description,
          },
        ])
        .select()

      if (error) throw error

      if (data && data.length > 0) {
        setCategories((prev) => [...prev, data[0]])
        toast({
          title: "Category created",
          description: `${newCategory.name} has been created successfully.`,
        })
        setNewCategory({ name: "", slug: "", description: "" })
        setIsCategoryDialogOpen(false)
      }
    } catch (error) {
      console.error("Error creating category:", error)
      toast({
        title: "Error",
        description: "Failed to create category. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditProduct = async (product: Product) => {
    setSelectedProduct(product)
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description || "",
      category: product.category,
      categories: product.categories || [product.category], // Use existing categories or create from category
      stock: product.stock,
      images: product.images || [],
      details: product.details || [],
      default_size: product.default_size || "",
      default_color: product.default_color || "",
    })

    // Set product attributes
    setHasSizes(Boolean(product.sizes && product.sizes.length > 0))
    setHasColors(Boolean(product.colors && product.colors.length > 0))
    setSizes(product.sizes || [])
    setColors(product.colors || [])

    // Set stock per variant - use stockPerVariant or stock_per_variant depending on what's available
    setStockPerVariant(product.stockPerVariant || product.stock_per_variant || {})

    // Reset uploaded images
    setUploadedImages([])
    setImageUrls(product.images || [])
    setPrimaryImageIndex(0)
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product)
    setDeleteError(null)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return

    setIsDeleting(true)
    setDeleteError(null)

    try {
      console.log(`Attempting to delete product: ${selectedProduct.name} (${selectedProduct.id})`)

      // Try to use the force delete endpoint
      const response = await fetch("/api/admin/force-delete-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: selectedProduct.id }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete product")
      }

      // Update the UI by removing the deleted product
      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id))

      toast({
        title: "Product deleted",
        description: `${selectedProduct.name} has been deleted successfully.`,
      })

      setIsDeleteDialogOpen(false)
      setSelectedProduct(null)
    } catch (error) {
      console.error("Error deleting product:", error)
      setDeleteError(error instanceof Error ? error.message : "Failed to delete product")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Reorder images to make the primary image first
      const productImages = [...imageUrls]
      if (primaryImageIndex > 0 && productImages.length > 1) {
        const primaryImage = productImages[primaryImageIndex]
        productImages.splice(primaryImageIndex, 1)
        productImages.unshift(primaryImage)
      }

      // Ensure category is set (use first category from categories array or default)
      const category = formData.categories.length > 0 ? formData.categories[0] : "our-dresses"

      // Calculate total stock from variant stock if using variants
      let totalStock = formData.stock
      if (hasSizes && hasColors) {
        totalStock = Object.values(stockPerVariant).reduce((sum, qty) => sum + qty, 0)
      }

      // Prepare product data with attributes
      const productData = {
        ...formData,
        category,
        stock: totalStock,
        images: productImages,
        sizes: hasSizes ? sizes : [],
        colors: hasColors ? colors : [],
        default_size: hasSizes ? formData.default_size : "",
        default_color: hasColors ? formData.default_color : "",
        stockPerVariant: hasSizes && hasColors ? stockPerVariant : {},
      }

      if (selectedProduct) {
        // Update existing product
        const updatedProduct = await updateProduct(selectedProduct.id, productData)
        if (updatedProduct) {
          setProducts((prev) => prev.map((p) => (p.id === selectedProduct.id ? updatedProduct : p)))
          toast({
            title: "Product updated",
            description: `${updatedProduct.name} has been updated successfully.`,
          })
        } else {
          throw new Error("Failed to update product")
        }
      } else {
        // Create new product
        const newProduct = await createProduct(productData)
        if (newProduct) {
          setProducts((prev) => [newProduct, ...prev])
          toast({
            title: "Product created",
            description: `${newProduct.name} has been created successfully.`,
          })
        } else {
          throw new Error("Failed to create product")
        }
      }

      setIsDialogOpen(false)
      setSelectedProduct(null)
      resetForm()
    } catch (error) {
      console.error("Error saving product:", error)
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
      description: "",
      category: "our-dresses",
      categories: [],
      stock: 0,
      images: [],
      details: [""],
      default_size: "",
      default_color: "",
    })
    setSizes([])
    setColors([])
    setHasSizes(false)
    setHasColors(false)
    setStockPerVariant({})
    setUploadedImages([])
    setImageUrls([])
    setPrimaryImageIndex(0)
  }

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />

      <div className="flex-1">
        <AdminHeader />

        <main className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-light">Products</h1>
              <p className="text-gray-600">Manage your product catalog</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md" aria-describedby="category-dialog-description">
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription id="category-dialog-description">
                      Create a new category for your products.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateCategory} className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Category Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={newCategory.name}
                        onChange={handleNewCategoryChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">
                        Slug <span className="text-xs text-gray-500">(used in URLs)</span>
                      </Label>
                      <Input
                        id="slug"
                        name="slug"
                        value={newCategory.slug}
                        onChange={handleNewCategoryChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={newCategory.description}
                        onChange={handleNewCategoryChange}
                        rows={3}
                      />
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Create Category</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setSelectedProduct(null)
                      resetForm()
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="max-w-2xl max-h-[90vh] overflow-y-auto"
                  aria-describedby="product-dialog-description"
                >
                  <DialogHeader>
                    <DialogTitle>{selectedProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                    <DialogDescription id="product-dialog-description">
                      {selectedProduct
                        ? "Update the product details below."
                        : "Fill in the details to add a new product to your catalog."}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    {/* Basic Info Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Basic Information</h3>

                      <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={4}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="price">Price (MAD)</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.price}
                          onChange={handleNumberChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Categories</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {categories.map((category) => (
                            <div key={category.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`category-${category.id}`}
                                checked={formData.categories.includes(category.slug)}
                                onCheckedChange={(checked) => handleCategoryChange(category.slug, checked === true)}
                              />
                              <Label htmlFor={`category-${category.id}`} className="cursor-pointer">
                                {category.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Images Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Product Images</h3>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imageUrls.map((url, index) => (
                          <div key={index} className="relative aspect-square border rounded-md overflow-hidden">
                            <Image
                              src={url || "/placeholder.svg"}
                              alt={`Product image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => handleSetPrimaryImage(index)}
                                className="w-full max-w-[120px]"
                              >
                                {index === primaryImageIndex ? "Primary Image" : "Set as Primary"}
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveImage(index)}
                                className="w-full max-w-[120px]"
                              >
                                Remove
                              </Button>
                            </div>
                            {index === primaryImageIndex && (
                              <div className="absolute top-1 right-1 bg-black text-white text-xs px-2 py-1 rounded">
                                Primary
                              </div>
                            )}
                          </div>
                        ))}
                        {imageUrls.length < 4 && (
                          <div className="aspect-square border rounded-md flex items-center justify-center">
                            <Label
                              htmlFor="image-upload"
                              className="cursor-pointer flex flex-col items-center justify-center w-full h-full"
                            >
                              {isUploading ? (
                                <div className="flex flex-col items-center">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
                                  <span className="text-sm text-gray-500">Uploading...</span>
                                </div>
                              ) : (
                                <>
                                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                  <span className="text-sm text-gray-500">Upload Image</span>
                                </>
                              )}
                              <Input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                disabled={isUploading}
                              />
                            </Label>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product Attributes */}
                    <Separator />
                    <ProductAttributes
                      sizes={sizes}
                      setSizes={setSizes}
                      colors={colors}
                      setColors={setColors}
                      defaultSize={formData.default_size || ""}
                      setDefaultSize={(size) => setFormData((prev) => ({ ...prev, default_size: size }))}
                      defaultColor={formData.default_color || ""}
                      setDefaultColor={(color) => setFormData((prev) => ({ ...prev, default_color: color }))}
                      hasSizes={hasSizes}
                      setHasSizes={setHasSizes}
                      hasColors={hasColors}
                      setHasColors={setHasColors}
                      stockPerVariant={stockPerVariant}
                      setStockPerVariant={setStockPerVariant}
                    />

                    <Separator />

                    {/* Additional Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Additional Details</h3>

                      <div className="space-y-2">
                        <Label htmlFor="details">Product Features (one item per line)</Label>
                        <Textarea
                          id="details"
                          value={formData.details.join("\n")}
                          onChange={handleDetailsChange}
                          rows={4}
                          placeholder="Crafted from premium silk blend
Delicate hand-sewn embroidery
Fully lined for comfort"
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isUploading}>
                        {selectedProduct ? "Update Product" : "Publish Product"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {error && (
            <div className="bg-red-500 text-white p-4 rounded-md mb-6">
              <p className="font-medium">Error</p>
              <p>{error}</p>
              <Button
                variant="outline"
                className="mt-2 bg-white text-red-500 hover:bg-red-100"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
            </div>
          )}

          <div className="bg-white rounded-md border">
            {isLoading ? (
              <div className="p-8 text-center">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="p-8 text-center">No products found</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Categories</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="relative h-10 w-10 overflow-hidden rounded-md">
                            {product.images && product.images.length > 0 ? (
                              <Image
                                src={product.images[0] || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                                No image
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          {product.categories && product.categories.length > 0
                            ? product.categories.join(", ")
                            : "Uncategorized"}
                        </TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>{product.price.toLocaleString("fr-MA")} د.م.</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleEditProduct(product)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-red-600"
                              onClick={() => handleDeleteClick(product)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent aria-describedby="delete-dialog-description">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription id="delete-dialog-description">
              Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {deleteError && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{deleteError}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
