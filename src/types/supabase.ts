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
          description: string | null
          id: number
          image_url: string | null
          name: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          name?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          name?: string | null
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
          description: string
          description_short: string | null
          details: Json
          display_mode: boolean
          event_image_url: string | null
          id: string
          is_beginner_friendly: boolean
          is_published: boolean
          location_latitude: number | null
          location_longitude: number | null
          location_name: string | null
          maximum_participants: number
          minimum_age: number | null
          name: string
          owner_id: string
          price: number
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          currency?: string
          date_end: string
          date_signup?: string | null
          date_start: string
          description?: string
          description_short?: string | null
          details?: Json
          display_mode?: boolean
          event_image_url?: string | null
          id?: string
          is_beginner_friendly?: boolean
          is_published?: boolean
          location_latitude?: number | null
          location_longitude?: number | null
          location_name?: string | null
          maximum_participants?: number
          minimum_age?: number | null
          name?: string
          owner_id?: string
          price?: number
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          currency?: string
          date_end?: string
          date_signup?: string | null
          date_start?: string
          description?: string
          description_short?: string | null
          details?: Json
          display_mode?: boolean
          event_image_url?: string | null
          id?: string
          is_beginner_friendly?: boolean
          is_published?: boolean
          location_latitude?: number | null
          location_longitude?: number | null
          location_name?: string | null
          maximum_participants?: number
          minimum_age?: number | null
          name?: string
          owner_id?: string
          price?: number
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
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string | null
          id?: string
          updated_at?: string | null
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
        Args: {
          schema: Json
          instance: Json
        }
        Returns: boolean
      }
      jsonb_matches_schema: {
        Args: {
          schema: Json
          instance: Json
        }
        Returns: boolean
      }
      jsonschema_is_valid: {
        Args: {
          schema: Json
        }
        Returns: boolean
      }
      jsonschema_validation_errors: {
        Args: {
          schema: Json
          instance: Json
        }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

