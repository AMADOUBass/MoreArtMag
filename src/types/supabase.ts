export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      artwork_stock: {
        Row: {
          artwork_sanity_id: string
          created_at: string
          currency: string
          id: string
          is_sold: boolean
          is_unique: boolean
          price_cents: number
          remaining: number | null
          size_sanity_id: string
          total_edition: number | null
          updated_at: string
        }
        Insert: {
          artwork_sanity_id: string
          created_at?: string
          currency?: string
          id?: string
          is_sold?: boolean
          is_unique?: boolean
          price_cents?: number
          remaining?: number | null
          size_sanity_id: string
          total_edition?: number | null
          updated_at?: string
        }
        Update: {
          artwork_sanity_id?: string
          created_at?: string
          currency?: string
          id?: string
          is_sold?: boolean
          is_unique?: boolean
          price_cents?: number
          remaining?: number | null
          size_sanity_id?: string
          total_edition?: number | null
          updated_at?: string
        }
      }
      cart_items: {
        Row: {
          artwork_sanity_id: string
          created_at: string
          currency: string
          id: string
          quantity: number
          session_id: string | null
          size_sanity_id: string
          unit_price_cents: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          artwork_sanity_id: string
          created_at?: string
          currency?: string
          id?: string
          quantity?: number
          session_id?: string | null
          size_sanity_id: string
          unit_price_cents: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          artwork_sanity_id?: string
          created_at?: string
          currency?: string
          id?: string
          quantity?: number
          session_id?: string | null
          size_sanity_id?: string
          unit_price_cents?: number
          updated_at?: string
          user_id?: string | null
        }
      }
      inquiries: {
        Row: {
          admin_notes: string | null
          artwork_reference: string | null
          budget_range: string | null
          created_at: string
          email: string
          id: string
          message: string
          metadata: Json | null
          name: string
          phone: string | null
          replied_at: string | null
          requested_size: string | null
          status: Database["public"]["Enums"]["inquiry_status"]
          subject: string
          type: Database["public"]["Enums"]["inquiry_type"]
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          artwork_reference?: string | null
          budget_range?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          metadata?: Json | null
          name: string
          phone?: string | null
          replied_at?: string | null
          requested_size?: string | null
          status?: Database["public"]["Enums"]["inquiry_status"]
          subject: string
          type?: Database["public"]["Enums"]["inquiry_type"]
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          artwork_reference?: string | null
          budget_range?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          metadata?: Json | null
          name?: string
          phone?: string | null
          replied_at?: string | null
          requested_size?: string | null
          status?: Database["public"]["Enums"]["inquiry_status"]
          subject?: string
          type?: Database["public"]["Enums"]["inquiry_type"]
          updated_at?: string
        }
      }
      newsletter_subscribers: {
        Row: {
          confirmation_token: string | null
          created_at: string
          email: string
          id: string
          is_confirmed: boolean
          unsubscribe_token: string | null
        }
        Insert: {
          confirmation_token?: string | null
          created_at?: string
          email: string
          id?: string
          is_confirmed?: boolean
          unsubscribe_token?: string | null
        }
        Update: {
          confirmation_token?: string | null
          created_at?: string
          email?: string
          id?: string
          is_confirmed?: boolean
          unsubscribe_token?: string | null
        }
      }
      order_items: {
        Row: {
          artwork_sanity_id: string
          created_at: string
          edition_number: string | null
          id: string
          image_url: string
          order_id: string
          quantity: number
          size_label: string
          title: string
          total_price_cents: number
          unit_price_cents: number
        }
        Insert: {
          artwork_sanity_id: string
          created_at?: string
          edition_number?: string | null
          id?: string
          image_url: string
          order_id: string
          quantity?: number
          size_label: string
          title: string
          total_price_cents: number
          unit_price_cents: number
        }
        Update: {
          artwork_sanity_id?: string
          created_at?: string
          edition_number?: string | null
          id?: string
          image_url?: string
          order_id?: string
          quantity?: number
          size_label?: string
          title?: string
          total_price_cents?: number
          unit_price_cents?: number
        }
      }
      orders: {
        Row: {
          admin_notes: string | null
          billing_address: Json
          created_at: string
          currency: string
          customer_email: string
          customer_name: string
          delivered_at: string | null
          id: string
          order_number: string
          shipping_address: Json
          shipping_cents: number
          shipped_at: string | null
          status: Database["public"]["Enums"]["order_status"]
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          subtotal_cents: number
          tax_cents: number
          total_cents: number
          tracking_number: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          billing_address: Json
          created_at?: string
          currency?: string
          customer_email: string
          customer_name: string
          delivered_at?: string | null
          id?: string
          order_number: string
          shipping_address: Json
          shipping_cents?: number
          shipped_at?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          subtotal_cents: number
          tax_cents?: number
          total_cents: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          billing_address?: Json
          created_at?: string
          currency?: string
          customer_email?: string
          customer_name?: string
          delivered_at?: string | null
          id?: string
          order_number?: string
          shipping_address?: Json
          shipping_cents?: number
          shipped_at?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          subtotal_cents?: number
          tax_cents?: number
          total_cents?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
      }
      room_presets: {
        Row: {
          category: string
          created_at: string
          description: string | null
          featured: boolean
          floor_height_normalized: number
          id: string
          image_url: string
          name: string
          slug: string
          sort_order: number
          thumbnail_url: string
          wall_height_cm: number
          wall_polygon: Json
          wall_width_cm: number
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          featured?: boolean
          floor_height_normalized?: number
          id?: string
          image_url: string
          name: string
          slug: string
          sort_order?: number
          thumbnail_url: string
          wall_height_cm: number
          wall_polygon: Json
          wall_width_cm: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          featured?: boolean
          floor_height_normalized?: number
          id?: string
          image_url?: string
          name?: string
          slug?: string
          sort_order?: number
          thumbnail_url?: string
          wall_height_cm?: number
          wall_polygon?: Json
          wall_width_cm?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      continent_type: "afrique" | "europe" | "amerique" | "asie" | "oceanie" | "autre"
      inquiry_status: "new" | "in_progress" | "replied" | "closed"
      inquiry_type: "general" | "commission" | "press" | "gallery"
      order_status: "pending" | "paid" | "shipped" | "delivered" | "cancelled" | "refunded"
      user_role: "customer" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
