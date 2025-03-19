import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getServerUser } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { ProgressStatus } from '@/lib/supabase/types';

// POST update level progress
export async function POST(
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

    // Parse the request body to get progress details
    const { status, score = 0 } = await request.json();
    
    const supabase = createServerSupabaseClient();

    // If marking as completed, use the database function for proper rewards
    if (status === ProgressStatus.COMPLETED) {
      const { data, error } = await supabase
        .rpc('complete_level', {
          p_user_id: user.id,
          p_level_id: levelId,
          p_score: score
        });

      if (error) {
        console.error('Error completing level:', error);
        return NextResponse.json(
          { error: 'Failed to complete level' },
          { status: 500 }
        );
      }

      return NextResponse.json(data);
    }

    // Otherwise, just update the progress
    const { data: existingProgress } = await supabase
      .from('progress')
      .select('id')
      .eq('user_id', user.id)
      .eq('level_id', levelId)
      .single();

    let result;
    if (existingProgress) {
      // Update existing progress
      const { data, error } = await supabase
        .from('progress')
        .update({
          status,
          last_accessed: new Date().toISOString(),
          score: status === ProgressStatus.IN_PROGRESS ? score : undefined
        })
        .eq('id', existingProgress.id)
        .select()
        .single();

      result = { data, error };
    } else {
      // Create new progress entry
      const { data, error } = await supabase
        .from('progress')
        .insert({
          user_id: user.id,
          level_id: levelId,
          status,
          score: status === ProgressStatus.IN_PROGRESS ? score : 0,
          completed: false,
          last_accessed: new Date().toISOString()
        })
        .select()
        .single();

      result = { data, error };
    }

    if (result.error) {
      console.error('Error updating progress:', result.error);
      return NextResponse.json(
        { error: 'Failed to update progress' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Level ${status === ProgressStatus.IN_PROGRESS ? 'started' : 'updated'}`,
      progress: result.data
    });
  } catch (error) {
    console.error('Unexpected error in level progress API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 