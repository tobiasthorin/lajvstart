export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      event_tags: {
        Row: {
          created_at: string
          description: string | null
          display_name: string
          id: string
          value: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_name: string
          id?: string
          value: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_name?: string
          id?: string
          value?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          date_end: string
          date_signup: string | null
          date_start: string
          description: string
          event_image_url: string | null
          id: string
          is_beginner_friendly: boolean
          location_latitude: number | null
          location_longitude: number | null
          location_name: string | null
          minimum_age: number | null
          name: string
          tags: string[] | null
        }
        Insert: {
          created_at?: string
          date_end: string
          date_signup?: string | null
          date_start: string
          description?: string
          event_image_url?: string | null
          id?: string
          is_beginner_friendly?: boolean
          location_latitude?: number | null
          location_longitude?: number | null
          location_name?: string | null
          minimum_age?: number | null
          name?: string
          tags?: string[] | null
        }
        Update: {
          created_at?: string
          date_end?: string
          date_signup?: string | null
          date_start?: string
          description?: string
          event_image_url?: string | null
          id?: string
          is_beginner_friendly?: boolean
          location_latitude?: number | null
          location_longitude?: number | null
          location_name?: string | null
          minimum_age?: number | null
          name?: string
          tags?: string[] | null
        }
        Relationships: []
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
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "userDetails_userId_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
