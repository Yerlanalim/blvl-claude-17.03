'use client';

import { useState, useEffect } from 'react';
import { Level, ProgressStatus } from '@/lib/supabase/types';
import { useProgress } from '@/contexts/ProgressContext';

type LevelDetailsResponse = Level & {
  progress: {
    status: string;
    completed: boolean;
    score: number;
    last_accessed: string;
  } | null;
  is_accessible: boolean;
  prerequisites: {
    id: string;
    title: string;
    order_index: number;
    thumbnail_url: string | null;
    is_completed: boolean;
  }[];
};

interface UseLevelDataProps {
  levelId: string | null;
}

export function useLevelData({ levelId }: UseLevelDataProps) {
  const [level, setLevel] = useState<LevelDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { startLevel, completeLevel } = useProgress();

  // Fetch level data when levelId changes
  useEffect(() => {
    if (!levelId) {
      setLevel(null);
      return;
    }

    fetchLevelData(levelId);
  }, [levelId]);

  // Fetch level data from API
  const fetchLevelData = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/levels/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch level data');
      }

      const data = await response.json();
      setLevel(data);
    } catch (error) {
      console.error('Error fetching level data:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Start the level
  const handleStartLevel = async () => {
    if (!levelId || !level?.is_accessible) return false;
    
    const result = await startLevel(levelId);
    if (result) {
      // Refetch the level data to update the UI
      fetchLevelData(levelId);
    }
    return result;
  };

  // Complete the level
  const handleCompleteLevel = async (score: number) => {
    if (!levelId || !level?.is_accessible) return null;
    
    const result = await completeLevel(levelId, score);
    if (result) {
      // Refetch the level data to update the UI
      fetchLevelData(levelId);
    }
    return result;
  };

  // Check if level is not started
  const isNotStarted = level?.progress?.status === ProgressStatus.NOT_STARTED || !level?.progress;
  
  // Check if level is in progress
  const isInProgress = level?.progress?.status === ProgressStatus.IN_PROGRESS;
  
  // Check if level is completed
  const isCompleted = level?.progress?.status === ProgressStatus.COMPLETED;

  return {
    level,
    isLoading,
    error,
    isAccessible: level?.is_accessible || false,
    isNotStarted,
    isInProgress,
    isCompleted,
    startLevel: handleStartLevel,
    completeLevel: handleCompleteLevel,
    refreshLevelData: () => levelId && fetchLevelData(levelId),
  };
} 