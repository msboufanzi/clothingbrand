export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          auth_id: string
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          role: string
        }
        Insert: {
          auth_id: string
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          role?: string
        }
        Update: {
          auth_id?: string
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_auth_id_fkey"
            columns: ["auth_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          orders_count: number | null
          phone: string | null
          postal_code: string | null
          total_spent: number | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          orders_count?: number | null
          phone?: string | null
          postal_code?: string | null
          total_spent?: number | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          orders_count?: number | null
          phone?: string | null
          postal_code?: string | null
          total_spent?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          admin_id: string
          created_at: string | null
          id: string
          message: string
          read: boolean
          title: string
          type: string
        }
        Insert: {
          admin_id: string
          created_at?: string | null
          id?: string
          message: string
          read?: boolean
          title: string
          type: string
        }
        Update: {
          admin_id?: string
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_admin_id_fkey"
            columns: ["admin_id"]
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          price: number
          product_id: string
          product_name: string
          quantity: number
          size?: string | null
          color?: string | null
          attributes?: Json | null
        }
        Insert: {
          id?: string
          order_id: string
          price: number
          product_id: string
          product_name: string
          quantity?: number
          size?: string | null
          color?: string | null
          attributes?: Json | null
        }
        Update: {
          id?: string
          order_id?: string
          price?: number
          product_id?: string
          product_name?: string
          quantity?: number
          size?: string | null
          color?: string | null
          attributes?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          city: string
          created_at: string | null
          customer_email: string
          customer_name: string
          customer_phone: string | null
          id: string
          payment_method: string
          postal_code: string
          shipping_address: string
          status: string
          total: number
          user_id: string | null
        }
        Insert: {
          city: string
          created_at?: string | null
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          id?: string
          payment_method: string
          postal_code: string
          shipping_address: string
          status?: string
          total: number
          user_id?: string | null
        }
        Update: {
          city?: string
          created_at?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          id?: string
          payment_method?: string
          postal_code?: string
          shipping_address?: string
          status?: string
          total?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          details: string[] | null
          id: string
          images: string[] | null
          name: string
          price: number
          stock: number
          sizes: Json | null
          colors: Json | null
          default_size: string | null
          default_color: string | null
          stock_per_variant: Json | null
          categories: string[] | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          details?: string[] | null
          id?: string
          images?: string[] | null
          name: string
          price: number
          stock?: number
          sizes?: Json | null
          colors?: Json | null
          default_size?: string | null
          default_color?: string | null
          stock_per_variant?: Json | null
          categories?: string[] | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          details?: string[] | null
          id?: string
          images?: string[] | null
          name?: string
          price?: number
          stock?: number
          sizes?: Json | null
          colors?: Json | null
          default_size?: string | null
          default_color?: string | null
          stock_per_variant?: Json | null
          categories?: string[] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
