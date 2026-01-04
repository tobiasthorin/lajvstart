export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
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
      characters: {
        Row: {
          created_at: string
          deleted: boolean
          description: string | null
          id: number
          image_url: string | null
          name: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted?: boolean
          description?: string | null
          id?: number
          image_url?: string | null
          name?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          deleted?: boolean
          description?: string | null
          id?: number
          image_url?: string | null
          name?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      event_groups: {
        Row: {
          created_at: string
          deleted: boolean
          description: string | null
          event_id: string | null
          id: string
          name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          deleted?: boolean
          description?: string | null
          event_id?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          deleted?: boolean
          description?: string | null
          event_id?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_groups_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          currency: string
          date_end: string
          date_signup: string | null
          date_start: string
          deleted: boolean
          description: string
          description_short: string
          details: Json
          display_mode: boolean
          event_banner_url: string | null
          event_image_url: string | null
          external_website_url: string | null
          has_been_announced: boolean | null
          id: string
          is_beginner_friendly: boolean
          is_published: boolean
          location_latitude: number | null
          location_longitude: number | null
          location_name: string | null
          maximum_participants: number | null
          minimum_age: number | null
          name: string
          owner_id: string
          price: number | null
          prices: Json | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          currency?: string
          date_end: string
          date_signup?: string | null
          date_start: string
          deleted?: boolean
          description?: string
          description_short: string
          details?: Json
          display_mode?: boolean
          event_banner_url?: string | null
          event_image_url?: string | null
          external_website_url?: string | null
          has_been_announced?: boolean | null
          id?: string
          is_beginner_friendly?: boolean
          is_published?: boolean
          location_latitude?: number | null
          location_longitude?: number | null
          location_name?: string | null
          maximum_participants?: number | null
          minimum_age?: number | null
          name?: string
          owner_id?: string
          price?: number | null
          prices?: Json | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          currency?: string
          date_end?: string
          date_signup?: string | null
          date_start?: string
          deleted?: boolean
          description?: string
          description_short?: string
          details?: Json
          display_mode?: boolean
          event_banner_url?: string | null
          event_image_url?: string | null
          external_website_url?: string | null
          has_been_announced?: boolean | null
          id?: string
          is_beginner_friendly?: boolean
          is_published?: boolean
          location_latitude?: number | null
          location_longitude?: number | null
          location_name?: string | null
          maximum_participants?: number | null
          minimum_age?: number | null
          name?: string
          owner_id?: string
          price?: number | null
          prices?: Json | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      favourites: {
        Row: {
          created_at: string
          event_id: string | null
          id: string
          updated_at: string | null
          user_details: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          id?: string
          updated_at?: string | null
          user_details?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string | null
          id?: string
          updated_at?: string | null
          user_details?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favourites_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favourites_user_details_fkey"
            columns: ["user_details"]
            isOneToOne: false
            referencedRelation: "user_details"
            referencedColumns: ["id"]
          },
        ]
      }
      mailings: {
        Row: {
          body: string
          created_at: string
          event_id: string
          id: number
          subject: string
          to: string[]
        }
        Insert: {
          body: string
          created_at?: string
          event_id: string
          id?: number
          subject: string
          to: string[]
        }
        Update: {
          body?: string
          created_at?: string
          event_id?: string
          id?: number
          subject?: string
          to?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "mailings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      registrations: {
        Row: {
          created_at: string
          deleted: boolean | null
          details: Json | null
          event_group: string | null
          event_id: string
          id: string
          is_approved: boolean
          is_paid: boolean
          updated_at: string | null
          user_details: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted?: boolean | null
          details?: Json | null
          event_group?: string | null
          event_id: string
          id?: string
          is_approved?: boolean
          is_paid?: boolean
          updated_at?: string | null
          user_details?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          deleted?: boolean | null
          details?: Json | null
          event_group?: string | null
          event_id?: string
          id?: string
          is_approved?: boolean
          is_paid?: boolean
          updated_at?: string | null
          user_details?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registrations_event_group_fkey"
            columns: ["event_group"]
            isOneToOne: false
            referencedRelation: "event_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registrations_user_details_fkey"
            columns: ["user_details"]
            isOneToOne: false
            referencedRelation: "user_details"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_details: {
        Row: {
          biography: string | null
          birth_date: string
          birth_date_public: boolean
          created_at: string
          email: string
          id: string
          name: string | null
          profile_picture_url: string | null
          special_needs: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          biography?: string | null
          birth_date: string
          birth_date_public?: boolean
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          profile_picture_url?: string | null
          special_needs?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          biography?: string | null
          birth_date?: string
          birth_date_public?: boolean
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          profile_picture_url?: string | null
          special_needs?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      json_matches_schema: {
        Args: { schema: Json; instance: Json }
        Returns: boolean
      }
      jsonb_matches_schema: {
        Args: { schema: Json; instance: Json }
        Returns: boolean
      }
      jsonschema_is_valid: {
        Args: { schema: Json }
        Returns: boolean
      }
      jsonschema_validation_errors: {
        Args: { schema: Json; instance: Json }
        Returns: string[]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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

