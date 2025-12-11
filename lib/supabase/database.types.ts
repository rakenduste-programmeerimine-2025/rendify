export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      chats: {
        Row: {
          created_at: string
          from_id: string
          id: number
          to_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          from_id?: string
          id?: number
          to_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          from_id?: string
          id?: number
          to_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Message_from_id_fkey"
            columns: ["from_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Message_to_id_fkey1"
            columns: ["to_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          chat_id: number
          created_at: string
          id: number
          message: string
          sender_id: string
        }
        Insert: {
          chat_id: number
          created_at?: string
          id?: number
          message: string
          sender_id?: string
        }
        Update: {
          chat_id?: number
          created_at?: string
          id?: number
          message?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats_with_names"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string
          id: string
          last_name: string
        }
        Insert: {
          created_at?: string
          first_name: string
          id?: string
          last_name: string
        }
        Update: {
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
        }
        Relationships: []
      }
      rent_dates: {
        Row: {
          created_at: string
          from: string
          id: number
          price_cents: number
          rent_offer: number
          to: string
          type: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          from: string
          id?: number
          price_cents: number
          rent_offer: number
          to: string
          type?: number | null
          user_id?: string
        }
        Update: {
          created_at?: string
          from?: string
          id?: number
          price_cents?: number
          rent_offer?: number
          to?: string
          type?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "RentDate_rent_offer_fkey"
            columns: ["rent_offer"]
            isOneToOne: false
            referencedRelation: "rent_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "RentDate_rent_offer_fkey"
            columns: ["rent_offer"]
            isOneToOne: false
            referencedRelation: "rent_offers_with_owner"
            referencedColumns: ["id"]
          },
        ]
      }
      rent_offers: {
        Row: {
          category: string
          created_at: string
          declined: boolean
          description: string | null
          id: number
          image_urls: string[] | null
          location: string | null
          price_cents: number
          title: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          declined?: boolean
          description?: string | null
          id?: number
          image_urls?: string[] | null
          location?: string | null
          price_cents: number
          title: string
          user_id?: string
        }
        Update: {
          category?: string
          created_at?: string
          declined?: boolean
          description?: string | null
          id?: number
          image_urls?: string[] | null
          location?: string | null
          price_cents?: number
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rent_offers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      chats_with_names: {
        Row: {
          created_at: string | null
          from_id: string | null
          from_name: string | null
          id: number | null
          to_id: string | null
          to_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          from_id?: string | null
          from_name?: never
          id?: number | null
          to_id?: string | null
          to_name?: never
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          from_id?: string | null
          from_name?: never
          id?: number | null
          to_id?: string | null
          to_name?: never
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Message_from_id_fkey"
            columns: ["from_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Message_to_id_fkey1"
            columns: ["to_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages_with_sender: {
        Row: {
          chat_id: number | null
          created_at: string | null
          id: number | null
          message: string | null
          sender_id: string | null
          sender_name: string | null
        }
        Insert: {
          chat_id?: number | null
          created_at?: string | null
          id?: number | null
          message?: string | null
          sender_id?: string | null
          sender_name?: never
        }
        Update: {
          chat_id?: number | null
          created_at?: string | null
          id?: number | null
          message?: string | null
          sender_id?: string | null
          sender_name?: never
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats_with_names"
            referencedColumns: ["id"]
          },
        ]
      }
      rent_dates_with_renter: {
        Row: {
          created_at: string | null
          from: string | null
          id: number | null
          price_cents: number | null
          rent_offer: number | null
          renter_name: string | null
          to: string | null
          type: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          from?: string | null
          id?: number | null
          price_cents?: number | null
          rent_offer?: number | null
          renter_name?: never
          to?: string | null
          type?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          from?: string | null
          id?: number | null
          price_cents?: number | null
          rent_offer?: number | null
          renter_name?: never
          to?: string | null
          type?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "RentDate_rent_offer_fkey"
            columns: ["rent_offer"]
            isOneToOne: false
            referencedRelation: "rent_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "RentDate_rent_offer_fkey"
            columns: ["rent_offer"]
            isOneToOne: false
            referencedRelation: "rent_offers_with_owner"
            referencedColumns: ["id"]
          },
        ]
      }
      rent_offers_with_owner: {
        Row: {
          category: string | null
          created_at: string | null
          declined: boolean | null
          description: string | null
          id: number | null
          image_urls: string[] | null
          location: string | null
          owner_id: string | null
          owner_name: string | null
          price_cents: number | null
          title: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          declined?: boolean | null
          description?: string | null
          id?: number | null
          image_urls?: string[] | null
          location?: string | null
          owner_id?: string | null
          owner_name?: never
          price_cents?: number | null
          title?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          declined?: boolean | null
          description?: string | null
          id?: number | null
          image_urls?: string[] | null
          location?: string | null
          owner_id?: string | null
          owner_name?: never
          price_cents?: number | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rent_offers_user_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_display_name_for_user: {
        Args: { p_prefix?: string; p_user_id: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
