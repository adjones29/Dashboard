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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      countdowns: {
        Row: {
          date: string | null
          id: string
          name: string
          position: number | null
          user_id: string | null
        }
        Insert: {
          date?: string | null
          id?: string
          name: string
          position?: number | null
          user_id?: string | null
        }
        Update: {
          date?: string | null
          id?: string
          name?: string
          position?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      kanban_tasks: {
        Row: {
          column: string | null
          id: string
          position: number | null
          text: string
          user_id: string | null
        }
        Insert: {
          column?: string | null
          id?: string
          position?: number | null
          text: string
          user_id?: string | null
        }
        Update: {
          column?: string | null
          id?: string
          position?: number | null
          text?: string
          user_id?: string | null
        }
        Relationships: []
      }
      okr_goals: {
        Row: {
          id: string
          position: number | null
          title: string
          user_id: string | null
        }
        Insert: {
          id?: string
          position?: number | null
          title: string
          user_id?: string | null
        }
        Update: {
          id?: string
          position?: number | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      okr_items: {
        Row: {
          goal_id: string | null
          id: string
          position: number | null
          text: string | null
          user_id: string | null
        }
        Insert: {
          goal_id?: string | null
          id?: string
          position?: number | null
          text?: string | null
          user_id?: string | null
        }
        Update: {
          goal_id?: string | null
          id?: string
          position?: number | null
          text?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "okr_items_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "okr_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      quick_links: {
        Row: {
          category: string
          color: string | null
          id: string
          label: string | null
          position: number | null
          url: string | null
          user_id: string | null
        }
        Insert: {
          category: string
          color?: string | null
          id?: string
          label?: string | null
          position?: number | null
          url?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string
          color?: string | null
          id?: string
          label?: string | null
          position?: number | null
          url?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      routines: {
        Row: {
          done: boolean | null
          id: string
          position: number | null
          text: string
          user_id: string | null
        }
        Insert: {
          done?: boolean | null
          id?: string
          position?: number | null
          text: string
          user_id?: string | null
        }
        Update: {
          done?: boolean | null
          id?: string
          position?: number | null
          text?: string
          user_id?: string | null
        }
        Relationships: []
      }
      todos: {
        Row: {
          done: boolean | null
          id: string
          position: number | null
          text: string
          user_id: string | null
        }
        Insert: {
          done?: boolean | null
          id?: string
          position?: number | null
          text: string
          user_id?: string | null
        }
        Update: {
          done?: boolean | null
          id?: string
          position?: number | null
          text?: string
          user_id?: string | null
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
  public: {
    Enums: {},
  },
} as const
