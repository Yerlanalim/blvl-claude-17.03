export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          level: number;
          xp: number;
          coins: number;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          level?: number;
          xp?: number;
          coins?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          level?: number;
          xp?: number;
          coins?: number;
        };
      };
      levels: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          description: string;
          order_index: number;
          thumbnail_url: string | null;
          xp_reward: number;
          coin_reward: number;
          required_level: number;
          is_active: boolean;
          content: Json | null;
          metadata: Json | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          description: string;
          order_index: number;
          thumbnail_url?: string | null;
          xp_reward?: number;
          coin_reward?: number;
          required_level?: number;
          is_active?: boolean;
          content?: Json | null;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          description?: string;
          order_index?: number;
          thumbnail_url?: string | null;
          xp_reward?: number;
          coin_reward?: number;
          required_level?: number;
          is_active?: boolean;
          content?: Json | null;
          metadata?: Json | null;
        };
      };
      level_prerequisites: {
        Row: {
          id: string;
          created_at: string;
          level_id: string;
          prerequisite_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          level_id: string;
          prerequisite_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          level_id?: string;
          prerequisite_id?: string;
        };
      };
      progress: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          level_id: string;
          completed: boolean;
          status: string;
          score: number;
          last_accessed: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          level_id: string;
          completed?: boolean;
          status?: string;
          score?: number;
          last_accessed?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          level_id?: string;
          completed?: boolean;
          status?: string;
          score?: number;
          last_accessed?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          description: string;
          xp_reward: number;
          coin_reward: number;
          icon_url: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          description: string;
          xp_reward?: number;
          coin_reward?: number;
          icon_url?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          description?: string;
          xp_reward?: number;
          coin_reward?: number;
          icon_url?: string;
        };
      };
      user_achievements: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          achievement_id: string;
          unlocked_at: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          achievement_id: string;
          unlocked_at?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          achievement_id?: string;
          unlocked_at?: string;
        };
      };
    };
    Views: {
      user_profile: {
        Row: {
          id: string;
          email: string | null;
          name: string | null;
          avatar_url: string | null;
          level: number | null;
          xp: number | null;
          coins: number | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: never;
        Update: never;
      };
      user_level_status: {
        Row: {
          level_id: string;
          order_index: number;
          title: string;
          description: string;
          thumbnail_url: string | null;
          status: string;
          is_accessible: boolean;
          is_completed: boolean;
          prerequisites_met: boolean;
          next_level: string | null;
        };
        Insert: never;
        Update: never;
      };
    };
    Functions: {
      check_level_access: {
        Args: {
          p_user_id: string;
          p_level_id: string;
        };
        Returns: boolean;
      };
      complete_level: {
        Args: {
          p_user_id: string;
          p_level_id: string;
          p_score?: number;
        };
        Returns: Json;
      };
      get_user_level_status: {
        Args: {
          p_user_id: string;
        };
        Returns: {
          level_id: string;
          order_index: number;
          title: string;
          description: string;
          thumbnail_url: string | null;
          status: string;
          is_accessible: boolean;
          is_completed: boolean;
          prerequisites_met: boolean;
          next_level: string | null;
        }[];
      };
    };
    Enums: {
      progress_status: 'not_started' | 'in_progress' | 'completed';
    };
  };
}
