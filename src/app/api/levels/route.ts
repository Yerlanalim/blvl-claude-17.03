import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getServerUser } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { ProgressStatus } from '@/lib/supabase/types';

// GET all levels with user progress
export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    // Get user's levels with status information
    const supabase = createServerSupabaseClient();
    const { data: levels, error } = await supabase
      .rpc('get_user_level_status', {
        p_user_id: user.id
      });

    if (error) {
      console.error('Error fetching levels:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch levels' 
      }, { status: 500 });
    }

    // Enhance levels with UI-specific information
    const enhancedLevels = levels.map(level => ({
      ...level,
      statusLabel: getStatusLabel(level.status),
      statusColor: getStatusColor(level.status),
      statusIcon: getStatusIcon(level.status, level.is_accessible)
    }));

    return NextResponse.json(enhancedLevels);
  } catch (error) {
    console.error('Unexpected error in levels API:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// Helper functions for UI elements
function getStatusLabel(status: string): string {
  switch (status) {
    case ProgressStatus.COMPLETED:
      return 'Completed';
    case ProgressStatus.IN_PROGRESS:
      return 'In Progress';
    case ProgressStatus.NOT_STARTED:
      return 'Not Started';
    default:
      return 'Unknown';
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case ProgressStatus.COMPLETED:
      return 'green';
    case ProgressStatus.IN_PROGRESS:
      return 'blue';
    case ProgressStatus.NOT_STARTED:
      return 'gray';
    default:
      return 'gray';
  }
}

function getStatusIcon(status: string, isAccessible: boolean): string {
  if (!isAccessible) {
    return 'lock';
  }
  
  switch (status) {
    case ProgressStatus.COMPLETED:
      return 'check-circle';
    case ProgressStatus.IN_PROGRESS:
      return 'clock';
    case ProgressStatus.NOT_STARTED:
      return 'circle';
    default:
      return 'circle';
  }
} 