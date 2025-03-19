import { Database } from './database.types';

// User types
export type UserProfile = {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  level: number;
  xp: number;
  coins: number;
  created_at: string;
  updated_at: string;
};

export type Users = Database['public']['Tables']['users']['Row'];

// Helper type for retrieving data from the user_profile view
export type UserProfileView = {
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

// Level and progression types
export type Level = Database['public']['Tables']['levels']['Row'];
export type LevelPrerequisite = Database['public']['Tables']['level_prerequisites']['Row'];
export type Progress = Database['public']['Tables']['progress']['Row'];

// Progress status enum
export enum ProgressStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

// User level status from the view
export type UserLevelStatus = Database['public']['Views']['user_level_status']['Row'];

// Extended level type with additional frontend properties
export type LevelWithStatus = UserLevelStatus & {
  statusLabel: string;
  statusColor: string;
  statusIcon: string;
};

// Response type for level completion
export type LevelCompletionResponse = {
  success: boolean;
  message: string;
  rewards?: {
    xp: number;
    coins: number;
  };
};

// Database table types for ease of use
export type Tables = Database['public']['Tables'];
export type TableRow<T extends keyof Tables> = Tables[T]['Row'];
export type TableInsert<T extends keyof Tables> = Tables[T]['Insert'];
export type TableUpdate<T extends keyof Tables> = Tables[T]['Update'];

// Generic type for Supabase response with data and error
export type SupabaseResponse<T> = {
  data: T | null;
  error: Error | null;
}; 