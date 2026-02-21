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

export type Database = {
  graphql_public: {
    CompositeTypes: {
      [_ in never]: never
    }
    Enums: {
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
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
  }
  public: {
    CompositeTypes: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    Functions: {
      json_matches_schema: {
        Args: { instance: Json; schema: Json }
        Returns: boolean
      }
      jsonb_matches_schema: {
        Args: { instance: Json; schema: Json }
        Returns: boolean
      }
      jsonschema_is_valid: {
        Args: { schema: Json }
        Returns: boolean
      }
      jsonschema_validation_errors: {
        Args: { instance: Json; schema: Json }
        Returns: string[]
      }
    }
    Tables: {
      characters: {
        Insert: {
          created_at?: string
          deleted?: boolean
          description?: null | string
          id?: number
          image_url?: null | string
          name?: null | string
          updated_at?: null | string
          user_id?: string
        }
        Relationships: []
        Row: {
          created_at: string
          deleted: boolean
          description: null | string
          id: number
          image_url: null | string
          name: null | string
          updated_at: null | string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted?: boolean
          description?: null | string
          id?: number
          image_url?: null | string
          name?: null | string
          updated_at?: null | string
          user_id?: string
        }
      }
      event_groups: {
        Insert: {
          created_at?: string
          deleted?: boolean
          description?: null | string
          event_id?: null | string
          id?: string
          name?: null | string
          updated_at?: null | string
        }
        Relationships: [
          {
            columns: ["event_id"]
            foreignKeyName: "event_groups_event_id_fkey"
            isOneToOne: false
            referencedColumns: ["id"]
            referencedRelation: "events"
          },
        ]
        Row: {
          created_at: string
          deleted: boolean
          description: null | string
          event_id: null | string
          id: string
          name: null | string
          updated_at: null | string
        }
        Update: {
          created_at?: string
          deleted?: boolean
          description?: null | string
          event_id?: null | string
          id?: string
          name?: null | string
          updated_at?: null | string
        }
      }
      events: {
        Insert: {
          created_at?: string
          currency?: string
          date_end: string
          date_signup?: null | string
          date_start: string
          deleted?: boolean
          description?: string
          description_short: string
          details?: Json
          display_mode?: boolean
          event_banner_url?: null | string
          event_image_url?: null | string
          external_website_url?: null | string
          has_been_announced?: boolean | null
          id?: string
          is_beginner_friendly?: boolean
          is_published?: boolean
          location_latitude?: null | number
          location_longitude?: null | number
          location_name?: null | string
          maximum_participants?: null | number
          minimum_age?: null | number
          name?: string
          owner_id?: string
          price?: null | number
          prices?: Json | null
          tags?: null | string[]
          updated_at?: null | string
        }
        Relationships: []
        Row: {
          created_at: string
          currency: string
          date_end: string
          date_signup: null | string
          date_start: string
          deleted: boolean
          description: string
          description_short: string
          details: Json
          display_mode: boolean
          event_banner_url: null | string
          event_image_url: null | string
          external_website_url: null | string
          has_been_announced: boolean | null
          id: string
          is_beginner_friendly: boolean
          is_published: boolean
          location_latitude: null | number
          location_longitude: null | number
          location_name: null | string
          maximum_participants: null | number
          minimum_age: null | number
          name: string
          owner_id: string
          price: null | number
          prices: Json | null
          tags: null | string[]
          updated_at: null | string
        }
        Update: {
          created_at?: string
          currency?: string
          date_end?: string
          date_signup?: null | string
          date_start?: string
          deleted?: boolean
          description?: string
          description_short?: string
          details?: Json
          display_mode?: boolean
          event_banner_url?: null | string
          event_image_url?: null | string
          external_website_url?: null | string
          has_been_announced?: boolean | null
          id?: string
          is_beginner_friendly?: boolean
          is_published?: boolean
          location_latitude?: null | number
          location_longitude?: null | number
          location_name?: null | string
          maximum_participants?: null | number
          minimum_age?: null | number
          name?: string
          owner_id?: string
          price?: null | number
          prices?: Json | null
          tags?: null | string[]
          updated_at?: null | string
        }
      }
      favourites: {
        Insert: {
          created_at?: string
          event_id?: null | string
          id?: string
          updated_at?: null | string
          user_details?: null | string
          user_id?: null | string
        }
        Relationships: [
          {
            columns: ["event_id"]
            foreignKeyName: "favourites_event_id_fkey"
            isOneToOne: false
            referencedColumns: ["id"]
            referencedRelation: "events"
          },
          {
            columns: ["user_details"]
            foreignKeyName: "favourites_user_details_fkey"
            isOneToOne: false
            referencedColumns: ["id"]
            referencedRelation: "user_details"
          },
        ]
        Row: {
          created_at: string
          event_id: null | string
          id: string
          updated_at: null | string
          user_details: null | string
          user_id: null | string
        }
        Update: {
          created_at?: string
          event_id?: null | string
          id?: string
          updated_at?: null | string
          user_details?: null | string
          user_id?: null | string
        }
      }
      mailings: {
        Insert: {
          body: string
          created_at?: string
          event_id: string
          id?: number
          subject: string
          to: string[]
        }
        Relationships: [
          {
            columns: ["event_id"]
            foreignKeyName: "mailings_event_id_fkey"
            isOneToOne: false
            referencedColumns: ["id"]
            referencedRelation: "events"
          },
        ]
        Row: {
          body: string
          created_at: string
          event_id: string
          id: number
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
      }
      registrations: {
        Insert: {
          created_at?: string
          deleted?: boolean | null
          details?: Json | null
          event_group?: null | string
          event_id: string
          id?: string
          is_approved?: boolean
          is_paid?: boolean
          updated_at?: null | string
          user_details?: null | string
          user_id: string
        }
        Relationships: [
          {
            columns: ["event_id"]
            foreignKeyName: "public_registrations_event_id_fkey"
            isOneToOne: false
            referencedColumns: ["id"]
            referencedRelation: "events"
          },
          {
            columns: ["event_group"]
            foreignKeyName: "registrations_event_group_fkey"
            isOneToOne: false
            referencedColumns: ["id"]
            referencedRelation: "event_groups"
          },
          {
            columns: ["user_details"]
            foreignKeyName: "registrations_user_details_fkey"
            isOneToOne: false
            referencedColumns: ["user_id"]
            referencedRelation: "user_details"
          },
        ]
        Row: {
          created_at: string
          deleted: boolean | null
          details: Json | null
          event_group: null | string
          event_id: string
          id: string
          is_approved: boolean
          is_paid: boolean
          updated_at: null | string
          user_details: null | string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted?: boolean | null
          details?: Json | null
          event_group?: null | string
          event_id?: string
          id?: string
          is_approved?: boolean
          is_paid?: boolean
          updated_at?: null | string
          user_details?: null | string
          user_id?: string
        }
      }
      user_details: {
        Insert: {
          biography?: null | string
          birth_date: string
          birth_date_public?: boolean
          created_at?: string
          email?: string
          id?: string
          name?: null | string
          profile_picture_url?: null | string
          special_needs?: null | string
          updated_at?: null | string
          user_id: string
        }
        Relationships: []
        Row: {
          biography: null | string
          birth_date: string
          birth_date_public: boolean
          created_at: string
          email: string
          id: string
          name: null | string
          profile_picture_url: null | string
          special_needs: null | string
          updated_at: null | string
          user_id: string
        }
        Update: {
          biography?: null | string
          birth_date?: string
          birth_date_public?: boolean
          created_at?: string
          email?: string
          id?: string
          name?: null | string
          profile_picture_url?: null | string
          special_needs?: null | string
          updated_at?: null | string
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
  }
}

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

export type Json =
  | boolean
  | Json[]
  | null
  | number
  | string
  | { [key: string]: Json | undefined }

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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
