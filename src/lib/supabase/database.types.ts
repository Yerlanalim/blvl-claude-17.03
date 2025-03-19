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
      courses: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          description: string;
          level: number;
          xp_reward: number;
          coin_reward: number;
          content: Json;
        };
        Insert: {
          id: string;
          created_at?: string;
          title: string;
          description: string;
          level?: number;
          xp_reward?: number;
          coin_reward?: number;
          content?: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          description?: string;
          level?: number;
          xp_reward?: number;
          coin_reward?: number;
          content?: Json;
        };
      };
      progress: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          course_id: string;
          completed: boolean;
          score: number;
          last_accessed: string;
        };
        Insert: {
          id: string;
          created_at?: string;
          user_id: string;
          course_id: string;
          completed?: boolean;
          score?: number;
          last_accessed?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          course_id?: string;
          completed?: boolean;
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
          id: string;
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
          id: string;
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
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
