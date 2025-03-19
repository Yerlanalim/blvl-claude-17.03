'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { LevelWithStatus, ProgressStatus, LevelCompletionResponse } from '@/lib/supabase/types';
import { useRouter } from 'next/navigation';

// Context types
type ProgressContextType = {
  levels: LevelWithStatus[];
  isLoading: boolean;
  error: string | null;
  refreshLevels: () => Promise<void>;
  getCurrentLevel: () => LevelWithStatus | undefined;
  getNextLevel: () => LevelWithStatus | undefined;
  startLevel: (levelId: string) => Promise<boolean>;
  completeLevel: (levelId: string, score: number) => Promise<LevelCompletionResponse | null>;
};

// Create the context with a default value
const ProgressContext = createContext<ProgressContextType>({
  levels: [],
  isLoading: false,
  error: null,
  refreshLevels: async () => {},
  getCurrentLevel: () => undefined,
  getNextLevel: () => undefined,
  startLevel: async () => false,
  completeLevel: async () => null,
});

// Provider component
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [levels, setLevels] = useState<LevelWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Initialize: Fetch all levels with their status
  useEffect(() => {
    refreshLevels();
  }, []);

  // Refresh levels data from the API
  const refreshLevels = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/levels');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch levels');
      }

      const data = await response.json();
      setLevels(data);
    } catch (error) {
      console.error('Error fetching levels:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Get current level (first incomplete accessible level)
  const getCurrentLevel = () => {
    return levels.find(level => 
      level.is_accessible && 
      (level.status === ProgressStatus.NOT_STARTED || level.status === ProgressStatus.IN_PROGRESS)
    );
  };

  // Get next level to unlock
  const getNextLevel = () => {
    const currentLevel = getCurrentLevel();
    if (!currentLevel) return undefined;
    
    return levels.find(level => level.order_index === currentLevel.order_index + 1);
  };

  // Mark a level as started
  const startLevel = async (levelId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/levels/${levelId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: ProgressStatus.IN_PROGRESS,
          score: 0,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start level');
      }

      await refreshLevels();
      return true;
    } catch (error) {
      console.error('Error starting level:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      return false;
    }
  };

  // Mark a level as completed
  const completeLevel = async (levelId: string, score: number): Promise<LevelCompletionResponse | null> => {
    try {
      const response = await fetch(`/api/levels/${levelId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: ProgressStatus.COMPLETED,
          score,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to complete level');
      }

      const completionData = await response.json();
      await refreshLevels();
      
      // Refresh user session to get updated user data
      const {
        data: { session },
      } = await supabase.auth.getSession();
      
      if (session) {
        // Refresh router to update any user data in the UI
        router.refresh();
      }
      
      return completionData;
    } catch (error) {
      console.error('Error completing level:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      return null;
    }
  };

  return (
    <ProgressContext.Provider
      value={{
        levels,
        isLoading,
        error,
        refreshLevels,
        getCurrentLevel,
        getNextLevel,
        startLevel,
        completeLevel,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

// Custom hook to use the progress context
export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
} 