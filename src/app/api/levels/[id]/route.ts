import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getServerUser } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET a specific level with user's progress
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const levelId = params.id;
    if (!levelId) {
      return NextResponse.json(
        { error: 'Level ID is required' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();
    
    // Get the level details
    const { data: level, error: levelError } = await supabase
      .from('levels')
      .select('*')
      .eq('id', levelId)
      .single();

    if (levelError) {
      console.error('Error fetching level:', levelError);
      return NextResponse.json(
        { error: 'Failed to fetch level' },
        { status: 500 }
      );
    }

    if (!level) {
      return NextResponse.json(
        { error: 'Level not found' },
        { status: 404 }
      );
    }

    // Get the user's progress for this level
    const { data: progress, error: progressError } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('level_id', levelId)
      .single();

    if (progressError && progressError.code !== 'PGRST116') { // Not found error is acceptable
      console.error('Error fetching progress:', progressError);
      return NextResponse.json(
        { error: 'Failed to fetch progress' },
        { status: 500 }
      );
    }

    // Check if the user has access to this level
    const { data: hasAccess, error: accessError } = await supabase
      .rpc('check_level_access', {
        p_user_id: user.id,
        p_level_id: levelId
      });

    if (accessError) {
      console.error('Error checking level access:', accessError);
      return NextResponse.json(
        { error: 'Failed to check level access' },
        { status: 500 }
      );
    }

    // Get the prerequisites for this level
    const { data: prerequisites, error: prerequisitesError } = await supabase
      .from('level_prerequisites')
      .select(`
        prerequisite_id,
        prerequisite:levels!inner(
          id,
          title,
          order_index,
          thumbnail_url
        )
      `)
      .eq('level_id', levelId);

    if (prerequisitesError) {
      console.error('Error fetching prerequisites:', prerequisitesError);
      return NextResponse.json(
        { error: 'Failed to fetch prerequisites' },
        { status: 500 }
      );
    }

    // Check which prerequisites are completed
    const prerequisiteIds = prerequisites.map(p => p.prerequisite_id);
    let completedPrerequisites: string[] = [];
    
    if (prerequisiteIds.length > 0) {
      const { data: completedProgress, error: completedError } = await supabase
        .from('progress')
        .select('level_id')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .in('level_id', prerequisiteIds);

      if (!completedError && completedProgress) {
        completedPrerequisites = completedProgress.map(p => p.level_id);
      }
    }

    // Format prerequisites with completion status
    const formattedPrerequisites = prerequisites.map(p => ({
      id: p.prerequisite_id,
      title: p.prerequisite.title,
      order_index: p.prerequisite.order_index,
      thumbnail_url: p.prerequisite.thumbnail_url,
      is_completed: completedPrerequisites.includes(p.prerequisite_id)
    }));

    // Return the combined data
    return NextResponse.json({
      ...level,
      progress: progress || null,
      is_accessible: hasAccess,
      prerequisites: formattedPrerequisites
    });
  } catch (error) {
    console.error('Unexpected error in level details API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 