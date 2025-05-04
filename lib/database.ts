import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// For server-side usage
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// For client-side usage (singleton pattern)
let clientInstance: ReturnType<typeof createClient<Database>> | null = null

export const getSupabaseClient = () => {
  if (typeof window === "undefined") {
    return supabase // Return server-side client when running on server
  }

  if (!clientInstance) {
    clientInstance = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    )
  }
  return clientInstance
}

// Define product attribute types
export type ProductSize = {
  value: string
  label: string
  inStock: boolean
}

export type ProductColor = {
  value: string
  label: string
  colorCode: string
  inStock: boolean
}

export type ProductAttribute = {
  name: string
  values: {
    value: string
    label: string
    inStock: boolean
  }[]
}

// Update the Product type to include attributes
export type Product = {
  id: string
  name: string
  price: number
  description: string
  details: string[]
  images: string[]
  category: string
  categories?: string[]
  stock: number
  created_at?: string
  sizes?: ProductSize[]
  colors?: ProductColor[]
  attributes?: ProductAttribute[]
  default_size?: string
  default_color?: string
  stock_per_variant?: Record<string, number>
  stockPerVariant?: Record<string, number> // Alias for consistency in our code
}

export type Order = {
  id: string
  user_id?: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  city: string
  postal_code: string
  total: number
  status: "pending" | "processing" | "delivered" | "cancelled"
  payment_method: "cash_on_delivery"
  created_at?: string
  items: OrderItem[]
}

export type OrderItem = {
  id?: string
  order_id?: string
  product_id: string
  product_name: string
  price: number
  quantity: number
  size?: string
  color?: string
  attributes?: Record<string, string>
}

export type Customer = {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  address?: string
  city?: string
  postal_code?: string
  orders_count: number
  total_spent: number
  created_at?: string
}

export type AdminUser = {
  id: string
  email: string
  first_name: string
  last_name: string
  role: "admin" | "editor"
  created_at?: string
}

export type Notification = {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  admin_id: string
  created_at?: string
}

// Products
export async function getProducts() {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  // Map stock_per_variant to stockPerVariant for consistency in our code
  return (data || []).map((product) => ({
    ...product,
    stockPerVariant: product.stock_per_variant,
  }))
}

export async function getProductById(id: string) {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching product ${id}:`, error)
    return null
  }

  // Map stock_per_variant to stockPerVariant for consistency in our code
  if (data) {
    return {
      ...data,
      stockPerVariant: data.stock_per_variant,
    }
  }

  return data
}

// Update the getProductsByCategory function to properly filter by category slug
export async function getProductsByCategory(category: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(`Error fetching products in category ${category}:`, error)
    return []
  }

  // Map stock_per_variant to stockPerVariant for consistency in our code
  return (data || []).map((product) => ({
    ...product,
    stockPerVariant: product.stock_per_variant,
  }))
}

// Update the createProduct function to handle attributes
export async function createProduct(product: Omit<Product, "id" | "created_at">) {
  // Ensure all image URLs are public URLs
  const publicImages = product.images.map((imageUrl) => {
    // If it's already a public URL, keep it
    if (imageUrl.includes("/storage/v1/object/public/")) {
      return imageUrl
    }

    // If it's a signed URL, extract the path and get a public URL
    if (imageUrl.includes("/storage/v1/object/sign/")) {
      const pathMatch = imageUrl.match(/\/storage\/v1\/object\/sign\/([^?]+)/)
      if (pathMatch && pathMatch[1]) {
        const [bucket, ...pathParts] = pathMatch[1].split("/")
        const path = pathParts.join("/")
        const { data } = supabase.storage.from(bucket).getPublicUrl(path)
        return data.publicUrl
      }
    }

    return imageUrl
  })

  // Ensure category is set (use first category from categories array or default)
  const category =
    product.category || (product.categories && product.categories.length > 0 ? product.categories[0] : "our-dresses")

  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        name: product.name,
        description: product.description,
        price: product.price,
        category,
        categories: product.categories,
        images: publicImages,
        stock: product.stock,
        details: product.details || [],
        sizes: product.sizes || [],
        colors: product.colors || [],
        default_size: product.default_size || "",
        default_color: product.default_color || "",
        stock_per_variant: product.stockPerVariant || {}, // Use stock_per_variant for the database column
      },
    ])
    .select()

  if (error) {
    console.error("Error creating product:", error)
    return null
  }

  // Map stock_per_variant to stockPerVariant for consistency in our code
  return {
    ...data[0],
    stockPerVariant: data[0].stock_per_variant,
  }
}

// Update the updateProduct function to handle attributes
export async function updateProduct(id: string, updates: Partial<Product>) {
  // Ensure all image URLs are public URLs if images are being updated
  if (updates.images) {
    updates.images = updates.images.map((imageUrl) => {
      // If it's already a public URL, keep it
      if (imageUrl.includes("/storage/v1/object/public/")) {
        return imageUrl
      }

      // If it's a signed URL, extract the path and get a public URL
      if (imageUrl.includes("/storage/v1/object/sign/")) {
        const pathMatch = imageUrl.match(/\/storage\/v1\/object\/sign\/([^?]+)/)
        if (pathMatch && pathMatch[1]) {
          const [bucket, ...pathParts] = pathMatch[1].split("/")
          const path = pathParts.join("/")
          const { data } = supabase.storage.from(bucket).getPublicUrl(path)
          return data.publicUrl
        }
      }

      return imageUrl
    })
  }

  // Ensure category is set if categories is being updated
  if (updates.categories && !updates.category) {
    updates.category = updates.categories.length > 0 ? updates.categories[0] : "our-dresses"
  }

  const { data, error } = await supabase
    .from("products")
    .update({
      name: updates.name,
      description: updates.description,
      price: updates.price,
      category: updates.category,
      categories: updates.categories,
      images: updates.images,
      stock: updates.stock,
      details: updates.details,
      sizes: updates.sizes,
      colors: updates.colors,
      default_size: updates.default_size,
      default_color: updates.default_color,
      stock_per_variant: updates.stockPerVariant, // Use stock_per_variant for the database column
    })
    .eq("id", id)
    .select()

  if (error) {
    console.error(`Error updating product ${id}:`, error)
    return null
  }

  // Map stock_per_variant to stockPerVariant for consistency in our code
  return {
    ...data[0],
    stockPerVariant: data[0].stock_per_variant,
  }
}

export async function deleteProduct(id: string) {
  try {
    console.log(`Attempting to delete product with ID: ${id}`)

    // First, check if the product exists
    const { data: product, error: checkError } = await supabase
      .from("products")
      .select("id, name")
      .eq("id", id)
      .single()

    if (checkError) {
      console.error(`Error checking product ${id}:`, checkError)
      return false
    }

    if (!product) {
      console.error(`Product with ID ${id} not found`)
      return false
    }

    console.log(`Found product to delete: ${product.name} (${product.id})`)

    // Delete any related records first (if applicable)
    // For example, if you have order_items that reference products, you might need to handle those

    // Now delete the product
    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting product ${id}:`, error)
      return false
    }

    console.log(`Successfully deleted product ${id}`)
    return true
  } catch (error) {
    console.error(`Unexpected error deleting product ${id}:`, error)
    return false
  }
}

// Orders
export async function getOrders() {
  // First get all orders
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })

  if (ordersError) {
    console.error("Error fetching orders:", ordersError)
    return []
  }

  // Then get order items for each order
  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const { data: items, error: itemsError } = await supabase.from("order_items").select("*").eq("order_id", order.id)

      if (itemsError) {
        console.error(`Error fetching items for order ${order.id}:`, itemsError)
        return { ...order, items: [] }
      }

      return { ...order, items: items || [] }
    }),
  )

  return ordersWithItems
}

export async function getOrderById(id: string) {
  const { data: order, error: orderError } = await supabase.from("orders").select("*").eq("id", id).single()

  if (orderError) {
    console.error(`Error fetching order ${id}:`, orderError)
    return null
  }

  const { data: items, error: itemsError } = await supabase.from("order_items").select("*").eq("order_id", id)

  if (itemsError) {
    console.error(`Error fetching items for order ${id}:`, itemsError)
    return { ...order, items: [] }
  }

  return { ...order, items: items || [] }
}

export async function createOrder(
  order: Omit<Order, "id" | "created_at" | "items">,
  items: Omit<OrderItem, "id" | "order_id" | "attributes" | "size" | "color">[],
) {
  try {
    // Start a transaction
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: order.user_id,
          customer_name: order.customer_name,
          customer_email: order.customer_email,
          customer_phone: order.customer_phone,
          shipping_address: order.shipping_address,
          city: order.city,
          postal_code: order.postal_code,
          total: order.total,
          status: order.status,
          payment_method: order.payment_method,
        },
      ])
      .select()

    if (orderError) {
      console.error("Error creating order:", orderError)
      return null
    }

    const newOrder = orderData[0]

    // Insert order items - only include fields that exist in the database schema
    const orderItems = items.map((item) => ({
      order_id: newOrder.id,
      product_id: item.product_id,
      product_name: item.product_name,
      price: item.price,
      quantity: item.quantity,
      // Remove size, color, and attributes as they don't exist in the schema
    }))

    console.log("Inserting order items:", JSON.stringify(orderItems))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      // In a real app, you would roll back the order here
      return null
    }

    // Update customer data - extract first and last name from customer_name
    const nameParts = order.customer_name.split(" ")
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(" ")

    await updateCustomerAfterOrder(order.customer_email, firstName, lastName, order.total)

    return {
      ...newOrder,
      items: orderItems,
    }
  } catch (error) {
    console.error("Error in createOrder:", error)
    return null
  }
}

export async function updateOrderStatus(id: string, status: Order["status"]) {
  const { data, error } = await supabase.from("orders").update({ status }).eq("id", id).select()

  if (error) {
    console.error(`Error updating order ${id}:`, error)
    return null
  }

  return data[0]
}

export async function deleteOrder(id: string) {
  try {
    // First delete the order items
    const { error: itemsError } = await supabase.from("order_items").delete().eq("order_id", id)

    if (itemsError) {
      console.error(`Error deleting items for order ${id}:`, itemsError)
      return false
    }

    // Then delete the order
    const { error: orderError } = await supabase.from("orders").delete().eq("id", id)

    if (orderError) {
      console.error(`Error deleting order ${id}:`, orderError)
      return false
    }

    return true
  } catch (error) {
    console.error(`Error in deleteOrder for ${id}:`, error)
    return false
  }
}

// Customers
export async function getCustomers() {
  const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching customers:", error)
    return []
  }

  return data || []
}

export async function getCustomerByEmail(email: string) {
  const { data, error } = await supabase.from("customers").select("*").eq("email", email).single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "No rows returned" error
    console.error(`Error fetching customer with email ${email}:`, error)
    return null
  }

  return data
}

export async function createCustomer(customer: Omit<Customer, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("customers")
    .insert([
      {
        ...customer,
        orders_count: customer.orders_count || 0,
        total_spent: customer.total_spent || 0,
      },
    ])
    .select()

  if (error) {
    console.error("Error creating customer:", error)
    return null
  }

  return data[0]
}

export async function updateCustomerAfterOrder(email: string, firstName: string, lastName: string, orderTotal: number) {
  // Check if customer exists
  const customer = await getCustomerByEmail(email)

  if (customer) {
    // Update existing customer
    const { data, error } = await supabase
      .from("customers")
      .update({
        orders_count: (customer.orders_count || 0) + 1,
        total_spent: (Number(customer.total_spent) || 0) + orderTotal,
      })
      .eq("id", customer.id)
      .select()

    if (error) {
      console.error(`Error updating customer ${customer.id}:`, error)
    }

    return data?.[0]
  } else {
    // Create new customer
    const newCustomer = await createCustomer({
      email,
      first_name: firstName,
      last_name: lastName,
      orders_count: 1,
      total_spent: orderTotal,
    })

    return newCustomer
  }
}

// Notifications
export async function getNotifications(adminId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("admin_id", adminId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching notifications:", error)
    return []
  }

  return data || []
}

export async function markNotificationAsRead(id: string) {
  const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id)

  if (error) {
    console.error(`Error marking notification ${id} as read:`, error)
    return false
  }

  return true
}

export async function markAllNotificationsAsRead(adminId: string) {
  const { error } = await supabase.from("notifications").update({ read: true }).eq("admin_id", adminId)

  if (error) {
    console.error(`Error marking all notifications as read for admin ${adminId}:`, error)
    return false
  }

  return true
}

export async function createNotification(notification: Omit<Notification, "id" | "created_at">) {
  const { data, error } = await supabase.from("notifications").insert([notification]).select()

  if (error) {
    console.error("Error creating notification:", error)
    return null
  }

  return data[0]
}

// Analytics
export async function getDashboardStats() {
  // Get total revenue
  const { data: revenueData, error: revenueError } = await supabase.from("orders").select("total")

  if (revenueError) {
    console.error("Error fetching revenue:", revenueError)
  }

  const totalRevenue = revenueData?.reduce((sum, order) => sum + (Number(order.total) || 0), 0) || 0

  // Get order counts
  const { count: ordersCount, error: ordersError } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })

  if (ordersError) {
    console.error("Error fetching orders count:", ordersError)
  }

  // Get new orders today
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { count: newOrdersToday, error: newOrdersError } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .gte("created_at", today.toISOString())

  if (newOrdersError) {
    console.error("Error fetching new orders:", newOrdersError)
  }

  // Get product count
  const { count: productsCount, error: productsError } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })

  if (productsError) {
    console.error("Error fetching products count:", productsError)
  }

  // Get new products this week
  const lastWeek = new Date()
  lastWeek.setDate(lastWeek.getDate() - 7)

  const { count: newProductsThisWeek, error: newProductsError } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .gte("created_at", lastWeek.toISOString())

  if (newProductsError) {
    console.error("Error fetching new products:", newProductsError)
  }

  // Get customer count
  const { count: customersCount, error: customersError } = await supabase
    .from("customers")
    .select("*", { count: "exact", head: true })

  if (customersError) {
    console.error("Error fetching customers count:", customersError)
  }

  // Get new customers this week
  const { count: newCustomersThisWeek, error: newCustomersError } = await supabase
    .from("customers")
    .select("*", { count: "exact", head: true })
    .gte("created_at", lastWeek.toISOString())

  if (newCustomersError) {
    console.error("Error fetching new customers:", newCustomersError)
  }

  return {
    totalRevenue,
    ordersCount: ordersCount || 0,
    newOrdersToday: newOrdersToday || 0,
    productsCount: productsCount || 0,
    newProductsThisWeek: newProductsThisWeek || 0,
    customersCount: customersCount || 0,
    newCustomersThisWeek: newCustomersThisWeek || 0,
  }
}

// Helper function to get a public URL for an image
export function getPublicImageUrl(bucket: string, path: string): string {
  try {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  } catch (error) {
    console.error("Error getting public URL:", error)
    return ""
  }
}

// Function to upload images and get public URLs
export async function uploadImagesAndGetPublicUrls(files: File[], bucketName = "product-images"): Promise<string[]> {
  const uploadedUrls: string[] = []

  try {
    // Assume the bucket exists and is public
    for (const file of files) {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`

      const { data, error } = await supabase.storage.from(bucketName).upload(fileName, file, {
        cacheControl: "31536000", // 1 year cache
        upsert: false,
        contentType: file.type,
      })

      if (error) {
        console.error("Error uploading image:", error)
        continue
      }

      // Get a public URL that doesn't expire
      const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(data.path)
      uploadedUrls.push(urlData.publicUrl)
    }

    return uploadedUrls
  } catch (error) {
    console.error("Error in uploadImagesAndGetPublicUrls:", error)
    return uploadedUrls
  }
}

// Function to fix existing product images
export async function fixProductImages(): Promise<boolean> {
  try {
    // Get all products
    const { data: products, error: productsError } = await supabase.from("products").select("id, images")

    if (productsError) {
      console.error("Error fetching products for image fix:", productsError)
      return false
    }

    // Update each product with public URLs
    for (const product of products || []) {
      if (!product.images || product.images.length === 0) continue

      const fixedImages = product.images.map((imageUrl: string) => {
        // If it's already a public URL, keep it
        if (imageUrl.includes("/storage/v1/object/public/")) {
          return imageUrl
        }

        // If it's a signed URL, extract the path and get a public URL
        if (imageUrl.includes("/storage/v1/object/sign/")) {
          const pathMatch = imageUrl.match(/\/storage\/v1\/object\/sign\/([^?]+)/)
          if (pathMatch && pathMatch[1]) {
            const [bucket, ...pathParts] = pathMatch[1].split("/")
            const path = pathParts.join("/")
            const { data } = supabase.storage.from(bucket).getPublicUrl(path)
            return data.publicUrl
          }
        }

        return imageUrl
      })

      // Update the product with fixed image URLs
      const { error: updateError } = await supabase
        .from("products")
        .update({ images: fixedImages })
        .eq("id", product.id)

      if (updateError) {
        console.error(`Error updating product ${product.id} images:`, updateError)
      }
    }

    return true
  } catch (error) {
    console.error("Error fixing product images:", error)
    return false
  }
}
