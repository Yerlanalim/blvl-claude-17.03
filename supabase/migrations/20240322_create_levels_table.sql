-- This migration creates the levels and level_prerequisites tables
-- These tables will store information about learning levels and their dependencies

-- Create the levels table
CREATE TABLE IF NOT EXISTS public.levels (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic info
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INTEGER NOT NULL UNIQUE, -- For explicit ordering of levels
  thumbnail_url TEXT, -- URL to the level's thumbnail image
  
  -- Game mechanics
  xp_reward INTEGER NOT NULL DEFAULT 100,
  coin_reward INTEGER NOT NULL DEFAULT 50,
  
  -- Level requirements and status
  required_level INTEGER NOT NULL DEFAULT 1, -- Minimum user level required
  is_active BOOLEAN NOT NULL DEFAULT true, -- Whether the level is currently active
  
  -- Content and metadata
  content JSONB, -- Structured content for the level
  metadata JSONB, -- Additional metadata for the level
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add comment to the table
COMMENT ON TABLE public.levels IS 'Learning progression levels with content and requirements';

-- Create indices for faster queries
CREATE INDEX IF NOT EXISTS levels_order_idx ON public.levels (order_index);
CREATE INDEX IF NOT EXISTS levels_required_level_idx ON public.levels (required_level);

-- Create the level prerequisites table for complex dependencies
CREATE TABLE IF NOT EXISTS public.level_prerequisites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level_id UUID NOT NULL REFERENCES public.levels(id) ON DELETE CASCADE,
  prerequisite_id UUID NOT NULL REFERENCES public.levels(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Ensure unique prerequisites
  CONSTRAINT unique_prerequisite UNIQUE (level_id, prerequisite_id),
  
  -- Prevent self-reference
  CONSTRAINT prevent_self_reference CHECK (level_id <> prerequisite_id)
);

-- Add comment to the prerequisites table
COMMENT ON TABLE public.level_prerequisites IS 'Dependencies between levels, defining which levels need to be completed before accessing others';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS level_prereq_level_idx ON public.level_prerequisites (level_id);
CREATE INDEX IF NOT EXISTS level_prereq_prerequisite_idx ON public.level_prerequisites (prerequisite_id);

-- Update the progress table to work with levels instead of courses
ALTER TABLE public.progress
  RENAME COLUMN course_id TO level_id;

-- Add status field to progress for more detailed tracking
ALTER TABLE public.progress
  ADD COLUMN status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed'));

-- Update the progress constraint to match the levels table
ALTER TABLE public.progress
  DROP CONSTRAINT IF EXISTS progress_course_id_fkey;

ALTER TABLE public.progress
  ADD CONSTRAINT progress_level_id_fkey FOREIGN KEY (level_id) REFERENCES public.levels(id) ON DELETE CASCADE;

-- Update timestamps on level updates
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to levels table
CREATE TRIGGER levels_updated_at
BEFORE UPDATE ON public.levels
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.level_prerequisites ENABLE ROW LEVEL SECURITY;

-- Create policy for anyone to view levels
CREATE POLICY "Anyone can view levels"
  ON public.levels
  FOR SELECT
  USING (true);

-- Create policy for anyone to view level prerequisites
CREATE POLICY "Anyone can view level prerequisites"
  ON public.level_prerequisites
  FOR SELECT
  USING (true);

-- Create policy for admins to manage levels (to be implemented later with admin roles)
-- For now, server-side functions will handle level management 