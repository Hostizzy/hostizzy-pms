// Database type definitions generated from Supabase schema
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'admin' | 'owner' | 'manager' | 'guest'
export type ReservationStatus = 'tentative' | 'confirmed' | 'cancelled' | 'completed'
export type BookingChannel = 'direct' | 'airbnb' | 'mmt' | 'booking' | 'other'
export type GuestRole = 'primary' | 'secondary'
export type IdType = 'aadhaar' | 'passport' | 'dl' | 'other'
export type MenuCategory = 'breakfast' | 'lunch' | 'dinner' | 'bbq' | 'alacarte'
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'bbq' | 'alacarte'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: UserRole
          name: string
          email: string
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: UserRole
          name: string
          email: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: UserRole
          name?: string
          email?: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      owners: {
        Row: {
          id: string
          user_id: string | null
          company_name: string | null
          gstin: string | null
          phone: string | null
          email: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          company_name?: string | null
          gstin?: string | null
          phone?: string | null
          email?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          company_name?: string | null
          gstin?: string | null
          phone?: string | null
          email?: string | null
          created_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          code: string
          name: string
          address: string | null
          city: string | null
          state: string | null
          pincode: string | null
          lat: number | null
          lng: number | null
          timezone: string | null
          bedrooms: number | null
          bathrooms: number | null
          max_guests: number
          amenities: Json | null
          has_pool: boolean | null
          has_lawn: boolean | null
          active: boolean | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          address?: string | null
          city?: string | null
          state?: string | null
          pincode?: string | null
          dob?: string | null
          created_at?: string
        }
      }
      reservations: {
        Row: {
          id: string
          reservation_code: string
          property_id: string | null
          primary_guest_id: string | null
          channel: BookingChannel | null
          check_in: string
          check_out: string
          adults: number
          children: number
          total_guests: number
          status: ReservationStatus | null
          base_rate_per_night: number | null
          extra_guest_fee_total: number | null
          cleaning_fee_total: number | null
          taxes_total: number | null
          discount_total: number | null
          total_amount: number
          currency: string | null
          notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reservation_code: string
          property_id?: string | null
          primary_guest_id?: string | null
          channel?: BookingChannel | null
          check_in: string
          check_out: string
          adults?: number
          children?: number
          total_guests: number
          status?: ReservationStatus | null
          base_rate_per_night?: number | null
          extra_guest_fee_total?: number | null
          cleaning_fee_total?: number | null
          taxes_total?: number | null
          discount_total?: number | null
          total_amount: number
          currency?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reservation_code?: string
          property_id?: string | null
          primary_guest_id?: string | null
          channel?: BookingChannel | null
          check_in?: string
          check_out?: string
          adults?: number
          children?: number
          total_guests?: number
          status?: ReservationStatus | null
          base_rate_per_night?: number | null
          extra_guest_fee_total?: number | null
          cleaning_fee_total?: number | null
          taxes_total?: number | null
          discount_total?: number | null
          total_amount?: number
          currency?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reservation_guests: {
        Row: {
          id: string
          reservation_id: string | null
          guest_id: string | null
          role: GuestRole
          created_at: string
        }
        Insert: {
          id?: string
          reservation_id?: string | null
          guest_id?: string | null
          role: GuestRole
          created_at?: string
        }
        Update: {
          id?: string
          reservation_id?: string | null
          guest_id?: string | null
          role?: GuestRole
          created_at?: string
        }
      }
      guest_ids: {
        Row: {
          id: string
          guest_id: string | null
          reservation_id: string | null
          id_type: IdType
          id_number: string
          file_url: string | null
          verified: boolean | null
          collected_at: string | null
          delete_after: string
          created_at: string
        }
        Insert: {
          id?: string
          guest_id?: string | null
          reservation_id?: string | null
          id_type: IdType
          id_number: string
          file_url?: string | null
          verified?: boolean | null
          collected_at?: string | null
          delete_after: string
          created_at?: string
        }
        Update: {
          id?: string
          guest_id?: string | null
          reservation_id?: string | null
          id_type?: IdType
          id_number?: string
          file_url?: string | null
          verified?: boolean | null
          collected_at?: string | null
          delete_after?: string
          created_at?: string
        }
      }
      availability_blocks: {
        Row: {
          id: string
          property_id: string | null
          start_date: string
          end_date: string
          reason: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          property_id?: string | null
          start_date: string
          end_date: string
          reason?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string | null
          start_date?: string
          end_date?: string
          reason?: string | null
          created_by?: string | null
          created_at?: string
        }
      }
      menus: {
        Row: {
          id: string
          property_id: string | null
          menu_category: MenuCategory
          item_name: string
          description: string | null
          is_veg: boolean | null
          price_per_person: number | null
          min_order_qty: number | null
          available_days: string | null
          is_fixed_menu: boolean | null
          is_optional: boolean | null
          active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id?: string | null
          menu_category: MenuCategory
          item_name: string
          description?: string | null
          is_veg?: boolean | null
          price_per_person?: number | null
          min_order_qty?: number | null
          available_days?: string | null
          is_fixed_menu?: boolean | null
          is_optional?: boolean | null
          active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string | null
          menu_category?: MenuCategory
          item_name?: string
          description?: string | null
          is_veg?: boolean | null
          price_per_person?: number | null
          min_order_qty?: number | null
          available_days?: string | null
          is_fixed_menu?: boolean | null
          is_optional?: boolean | null
          active?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      meal_selections: {
        Row: {
          id: string
          reservation_id: string | null
          date: string
          meal_type: MealType
          selection: Json | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reservation_id?: string | null
          date: string
          meal_type: MealType
          selection?: Json | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reservation_id?: string | null
          date?: string
          meal_type?: MealType
          selection?: Json | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          reservation_id: string | null
          property_id: string | null
          guest_id: string | null
          rating: number | null
          title: string | null
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          reservation_id?: string | null
          property_id?: string | null
          guest_id?: string | null
          rating?: number | null
          title?: string | null
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          reservation_id?: string | null
          property_id?: string | null
          guest_id?: string | null
          rating?: number | null
          title?: string | null
          comment?: string | null
          created_at?: string
        }
      }
      analytics_daily: {
        Row: {
          dt: string
          property_id: string | null
          reservations: number | null
          room_nights: number | null
          revenue: number | null
          adr: number | null
          occupancy: number | null
          revpar: number | null
        }
        Insert: {
          dt: string
          property_id?: string | null
          reservations?: number | null
          room_nights?: number | null
          revenue?: number | null
          adr?: number | null
          occupancy?: number | null
          revpar?: number | null
        }
        Update: {
          dt?: string
          property_id?: string | null
          reservations?: number | null
          room_nights?: number | null
          revenue?: number | null
          adr?: number | null
          occupancy?: number | null
          revpar?: number | null
        }
      }
      audit_logs: {
        Row: {
          id: string
          actor_id: string | null
          action: string
          entity: string
          entity_id: string | null
          diff: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          actor_id?: string | null
          action: string
          entity: string
          entity_id?: string | null
          diff?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          actor_id?: string | null
          action?: string
          entity?: string
          entity_id?: string | null
          diff?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      user_owns_property: {
        Args: {
          property_uuid: string
        }
        Returns: boolean
      }
      user_manages_property: {
        Args: {
          property_uuid: string
        }
        Returns: boolean
      }
      generate_reservation_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      user_role: UserRole
      reservation_status: ReservationStatus
      booking_channel: BookingChannel
      guest_role: GuestRole
      id_type: IdType
      menu_category: MenuCategory
      meal_type: MealType
    }
  }
}

// Extended types for application use
export interface PropertyWithOwners extends Database['public']['Tables']['properties']['Row'] {
  property_owners: {
    owners: Database['public']['Tables']['owners']['Row'] & {
      profiles: Database['public']['Tables']['profiles']['Row']
    }
  }[]
}

export interface ReservationWithGuests extends Database['public']['Tables']['reservations']['Row'] {
  properties: Database['public']['Tables']['properties']['Row'] | null
  guests: Database['public']['Tables']['guests']['Row'] | null
  reservation_guests: {
    guests: Database['public']['Tables']['guests']['Row']
    role: GuestRole
  }[]
}

export interface MealSelection {
  items: {
    menu_id: string
    qty: number
  }[]
}

export interface AnalyticsSummary {
  totalRevenue: number
  totalReservations: number
  occupancyRate: number
  adr: number
  revpar: number
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
          lat?: number | null
          lng?: number | null
          timezone?: string | null
          bedrooms?: number | null
          bathrooms?: number | null
          max_guests: number
          amenities?: Json | null
          has_pool?: boolean | null
          has_lawn?: boolean | null
          active?: boolean | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          address?: string | null
          city?: string | null
          state?: string | null
          pincode?: string | null
          lat?: number | null
          lng?: number | null
          timezone?: string | null
          bedrooms?: number | null
          bathrooms?: number | null
          max_guests?: number
          amenities?: Json | null
          has_pool?: boolean | null
          has_lawn?: boolean | null
          active?: boolean | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      property_owners: {
        Row: {
          id: string
          property_id: string | null
          owner_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          property_id?: string | null
          owner_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string | null
          owner_id?: string | null
          created_at?: string
        }
      }
      managers_properties: {
        Row: {
          id: string
          property_id: string | null
          manager_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          property_id?: string | null
          manager_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string | null
          manager_id?: string | null
          created_at?: string
        }
      }
      guests: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          pincode: string | null
          dob: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          pincode?: string | null
          dob?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          pincode?: string | null
