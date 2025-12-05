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
  public: {
    Tables: {
      pre_survey_responses: {
        Row: {
          category_code: string
          created_at: string
          id: string
          question_index: number
          response_value: number
          user_id: string
        }
        Insert: {
          category_code: string
          created_at?: string
          id?: string
          question_index: number
          response_value: number
          user_id: string
        }
        Update: {
          category_code?: string
          created_at?: string
          id?: string
          question_index?: number
          response_value?: number
          user_id?: string
        }
        Relationships: []
      }
      pre_survey_results: {
        Row: {
          category_code: string
          category_name: string
          completed_at: string
          id: string
          max_score: number
          national_average: number
          recommendation: string | null
          user_id: string
          user_score: number
        }
        Insert: {
          category_code: string
          category_name: string
          completed_at?: string
          id?: string
          max_score: number
          national_average: number
          recommendation?: string | null
          user_id: string
          user_score: number
        }
        Update: {
          category_code?: string
          category_name?: string
          completed_at?: string
          id?: string
          max_score?: number
          national_average?: number
          recommendation?: string | null
          user_id?: string
          user_score?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          date_of_birth: string
          gender: Database["public"]["Enums"]["gender"]
          id: string
          name: string
          pre_survey_completed: boolean
          updated_at: string
          user_id: string
          years_teaching_experience: number
        }
        Insert: {
          created_at?: string
          date_of_birth: string
          gender: Database["public"]["Enums"]["gender"]
          id?: string
          name: string
          pre_survey_completed?: boolean
          updated_at?: string
          user_id: string
          years_teaching_experience: number
        }
        Update: {
          created_at?: string
          date_of_birth?: string
          gender?: Database["public"]["Enums"]["gender"]
          id?: string
          name?: string
          pre_survey_completed?: boolean
          updated_at?: string
          user_id?: string
          years_teaching_experience?: number
        }
        Relationships: []
      }
      session_surveys: {
        Row: {
          activity_involvement: string[] | null
          confidence_change: string | null
          created_at: string
          design_difficulty: string | null
          engagement_other: string | null
          engagement_types: string[]
          id: string
          non_engagement_other: string | null
          non_engagement_reasons: string[] | null
          practice_difficulty: string | null
          time_spent: string | null
          user_id: string
        }
        Insert: {
          activity_involvement?: string[] | null
          confidence_change?: string | null
          created_at?: string
          design_difficulty?: string | null
          engagement_other?: string | null
          engagement_types: string[]
          id?: string
          non_engagement_other?: string | null
          non_engagement_reasons?: string[] | null
          practice_difficulty?: string | null
          time_spent?: string | null
          user_id: string
        }
        Update: {
          activity_involvement?: string[] | null
          confidence_change?: string | null
          created_at?: string
          design_difficulty?: string | null
          engagement_other?: string | null
          engagement_types?: string[]
          id?: string
          non_engagement_other?: string | null
          non_engagement_reasons?: string[] | null
          practice_difficulty?: string | null
          time_spent?: string | null
          user_id?: string
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
      gender: "male" | "female" | "other" | "prefer_not_to_say"
      survey_type: "pre" | "post"
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
    Enums: {
      gender: ["male", "female", "other", "prefer_not_to_say"],
      survey_type: ["pre", "post"],
    },
  },
} as const
