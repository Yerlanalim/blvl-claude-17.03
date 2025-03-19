-- This migration creates functions to check and update level access
-- These functions implement the progression logic for level unlocking

-- Function to check if a user has access to a specific level
CREATE OR REPLACE FUNCTION public.check_level_access(
  p_user_id UUID,
  p_level_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_level INTEGER;
  level_required_level INTEGER;
  prerequisites_completed BOOLEAN;
BEGIN
  -- Get user's current level
  SELECT level INTO user_level
  FROM public.users
  WHERE id = p_user_id;
  
  IF user_level IS NULL THEN
    RETURN FALSE; -- User not found
  END IF;
  
  -- Get level's required user level
  SELECT required_level, is_active INTO level_required_level, prerequisites_completed
  FROM public.levels
  WHERE id = p_level_id;
  
  IF level_required_level IS NULL THEN
    RETURN FALSE; -- Level not found
  END IF;
  
  -- Check if level is active
  IF NOT prerequisites_completed THEN
    RETURN FALSE; -- Level not active
  END IF;
  
  -- Check if user level meets requirement
  IF user_level < level_required_level THEN
    RETURN FALSE; -- User level too low
  END IF;
  
  -- Check if all prerequisites are completed
  SELECT EXISTS (
    SELECT 1
    FROM public.level_prerequisites lp
    LEFT JOIN public.progress p ON p.level_id = lp.prerequisite_id AND p.user_id = p_user_id
    WHERE lp.level_id = p_level_id
    AND (p.id IS NULL OR p.status != 'completed')
  ) INTO prerequisites_completed;
  
  IF prerequisites_completed THEN
    RETURN FALSE; -- Not all prerequisites completed
  END IF;
  
  -- First level or all checks passed
  RETURN TRUE;
END;
$$;

-- Function to update level progress and unlock next levels
CREATE OR REPLACE FUNCTION public.complete_level(
  p_user_id UUID,
  p_level_id UUID,
  p_score INTEGER DEFAULT 100
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  level_record RECORD;
  progress_exists BOOLEAN;
  result JSONB;
BEGIN
  -- Check if user has access to the level
  IF NOT public.check_level_access(p_user_id, p_level_id) THEN
    RETURN jsonb_build_object('success', FALSE, 'message', 'No access to this level');
  END IF;
  
  -- Get level details
  SELECT * INTO level_record
  FROM public.levels
  WHERE id = p_level_id;
  
  -- Check if progress record exists
  SELECT EXISTS (
    SELECT 1 FROM public.progress
    WHERE user_id = p_user_id AND level_id = p_level_id
  ) INTO progress_exists;
  
  -- Update or create progress record
  IF progress_exists THEN
    UPDATE public.progress
    SET 
      completed = TRUE,
      status = 'completed',
      score = p_score,
      last_accessed = NOW()
    WHERE 
      user_id = p_user_id AND 
      level_id = p_level_id;
  ELSE
    INSERT INTO public.progress (
      id, user_id, level_id, completed, status, score, last_accessed, created_at
    ) VALUES (
      gen_random_uuid(), p_user_id, p_level_id, TRUE, 'completed', p_score, NOW(), NOW()
    );
  END IF;
  
  -- Update user XP and coins
  UPDATE public.users
  SET 
    xp = xp + level_record.xp_reward,
    coins = coins + level_record.coin_reward,
    -- Level up if enough XP (simplified calculation, can be customized)
    level = GREATEST(level, level_record.required_level)
  WHERE id = p_user_id;
  
  -- Return success with rewards
  result = jsonb_build_object(
    'success', TRUE,
    'message', 'Level completed successfully',
    'rewards', jsonb_build_object(
      'xp', level_record.xp_reward,
      'coins', level_record.coin_reward
    )
  );
  
  RETURN result;
END;
$$;

-- Function to get available levels for a user
CREATE OR REPLACE FUNCTION public.get_user_level_status(
  p_user_id UUID
)
RETURNS TABLE (
  level_id UUID,
  order_index INTEGER,
  title TEXT,
  description TEXT,
  thumbnail_url TEXT,
  status TEXT,
  is_accessible BOOLEAN,
  is_completed BOOLEAN,
  prerequisites_met BOOLEAN,
  next_level UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH user_progress AS (
    SELECT 
      p.level_id,
      p.status,
      p.completed
    FROM 
      public.progress p
    WHERE 
      p.user_id = p_user_id
  ),
  user_info AS (
    SELECT level
    FROM public.users
    WHERE id = p_user_id
  ),
  level_prereqs AS (
    SELECT 
      lp.level_id,
      bool_and(up.completed) AS prerequisites_met
    FROM 
      public.level_prerequisites lp
    LEFT JOIN 
      user_progress up ON lp.prerequisite_id = up.level_id
    GROUP BY 
      lp.level_id
  )
  SELECT 
    l.id AS level_id,
    l.order_index,
    l.title,
    l.description,
    l.thumbnail_url,
    COALESCE(up.status, 'not_started') AS status,
    (COALESCE(ui.level >= l.required_level, FALSE) AND 
     COALESCE(lp.prerequisites_met, TRUE) AND 
     l.is_active) AS is_accessible,
    COALESCE(up.completed, FALSE) AS is_completed,
    COALESCE(lp.prerequisites_met, TRUE) AS prerequisites_met,
    (SELECT l2.id 
     FROM public.levels l2 
     WHERE l2.order_index = l.order_index + 1 
     LIMIT 1) AS next_level
  FROM 
    public.levels l
  LEFT JOIN 
    user_progress up ON l.id = up.level_id
  LEFT JOIN 
    level_prereqs lp ON l.id = lp.level_id
  CROSS JOIN 
    user_info ui
  ORDER BY 
    l.order_index;
END;
$$; 