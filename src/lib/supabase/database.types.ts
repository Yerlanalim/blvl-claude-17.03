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
      users: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          business_type: string | null
          business_size: string | null
          created_at: string
          last_login: string | null
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          business_type?: string | null
          business_size?: string | null
          created_at?: string
          last_login?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          business_type?: string | null
          business_size?: string | null
          created_at?: string
          last_login?: string | null
          updated_at?: string
        }
      }
      levels: {
        Row: {
          id: string
          order_number: number
          title: string
          description: string | null
          thumbnail_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: number
          title: string
          description?: string | null
          thumbnail_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: number
          title?: string
          description?: string | null
          thumbnail_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      videos: {
        Row: {
          id: string
          level_id: string
          order_number: number
          title: string
          url: string
          duration: number | null
          thumbnail_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          level_id: string
          order_number: number
          title: string
          url: string
          duration?: number | null
          thumbnail_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          level_id?: string
          order_number?: number
          title?: string
          url?: string
          duration?: number | null
          thumbnail_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      artifacts: {
        Row: {
          id: string
          level_id: string
          title: string
          description: string | null
          file_url: string
          file_type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          level_id: string
          title: string
          description?: string | null
          file_url: string
          file_type: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          level_id?: string
          title?: string
          description?: string | null
          file_url?: string
          file_type?: string
          created_at?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_skills: {
        Row: {
          id: string
          user_id: string
          skill_id: string
          proficiency_level: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skill_id: string
          proficiency_level?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          skill_id?: string
          proficiency_level?: number
          created_at?: string
          updated_at?: string
        }
      }
      progress: {
        Row: {
          id: string
          user_id: string
          level_id: string
          status: 'not_started' | 'in_progress' | 'completed'
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          level_id: string
          status: 'not_started' | 'in_progress' | 'completed'
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          level_id?: string
          status?: 'not_started' | 'in_progress' | 'completed'
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          title: string
          description: string | null
          badge_url: string | null
          criteria: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          badge_url?: string | null
          criteria?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          badge_url?: string | null
          criteria?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          achieved_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          achieved_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          achieved_at?: string
          created_at?: string
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
      [_ in never]: never
    }
  }
}
