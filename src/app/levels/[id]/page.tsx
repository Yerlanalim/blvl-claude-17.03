'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLevelData } from '@/hooks/useLevelData';
import { LevelCompletionResponse } from '@/lib/supabase/types';
import LevelCompletionModal from '@/components/levels/LevelCompletionModal';
import { 
  ArrowLeftIcon, 
  LockClosedIcon, 
  PlayIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/solid';

export default function LevelDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const levelId = params.id;
  const router = useRouter();
  const { 
    level, 
    isLoading, 
    error, 
    isAccessible,
    isNotStarted,
    isInProgress,
    isCompleted,
    startLevel,
    completeLevel
  } = useLevelData({ levelId });
  
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [completionData, setCompletionData] = useState<LevelCompletionResponse | null>(null);
  
  // Handle starting the level
  const handleStartLevel = async () => {
    if (!isAccessible) return;
    
    const success = await startLevel();
    if (success) {
      // Show some UI feedback
      console.log('Level started successfully');
    }
  };
  
  // Handle completing the level
  const handleCompleteLevel = async () => {
    if (!isAccessible) return;
    
    // In a real application, this score would come from actual user performance
    const score = 85; // Example score
    
    const result = await completeLevel(score);
    if (result) {
      setCompletionData(result);
      setIsCompletionModalOpen(true);
    }
  };
  
  // Handle going back to levels page
  const handleBackToLevels = () => {
    router.push('/levels');
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error || !level) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 p-4 rounded-md">
            <h2 className="text-red-800 font-medium text-lg">Error loading level</h2>
            <p className="text-red-700 mt-1">{error || 'Level not found'}</p>
            <button
              onClick={handleBackToLevels}
              className="mt-3 inline-flex items-center px-3 py-1.5 border border-red-300 text-sm leading-5 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Levels
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Determine the action button based on level status
  const ActionButton = () => {
    if (!isAccessible) {
      return (
        <button
          disabled
          className="flex items-center justify-center w-full px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-gray-400 cursor-not-allowed"
        >
          <LockClosedIcon className="h-5 w-5 mr-2" />
          Level Locked
        </button>
      );
    }
    
    if (isNotStarted) {
      return (
        <button
          onClick={handleStartLevel}
          className="flex items-center justify-center w-full px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlayIcon className="h-5 w-5 mr-2" />
          Start Level
        </button>
      );
    }
    
    if (isInProgress) {
      return (
        <button
          onClick={handleCompleteLevel}
          className="flex items-center justify-center w-full px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          <CheckCircleIcon className="h-5 w-5 mr-2" />
          Complete Level
        </button>
      );
    }
    
    if (isCompleted) {
      return (
        <button
          onClick={handleCompleteLevel}
          className="flex items-center justify-center w-full px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <ArrowPathIcon className="h-5 w-5 mr-2" />
          Complete Again
        </button>
      );
    }
    
    return null;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={handleBackToLevels}
          className="mb-4 inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Levels
        </button>
        
        {/* Level header */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mr-2">
              Level {level.order_index}
            </span>
            {level.is_accessible ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Accessible
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Locked
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{level.title}</h1>
          <p className="text-gray-600 mt-2">{level.description}</p>
        </div>
        
        {/* Level content and action section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Content section - this would be more detailed in a real application */}
          <div className="p-6">
            {/* For demo purposes, we'll render the JSON content */}
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Level Content</h2>
            
            {level.content ? (
              <div className="prose max-w-none">
                {/* Simple rendering of content for demo purposes */}
                {(level.content as any).sections?.map((section: any, index: number) => (
                  <div key={index} className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                    <p className="mt-2">{section.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">This level has no content yet.</p>
            )}
          </div>
          
          {/* Prerequisites section */}
          {level.prerequisites && level.prerequisites.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Prerequisites</h3>
              <ul className="space-y-2">
                {level.prerequisites.map((prereq) => (
                  <li key={prereq.id} className="flex items-center">
                    {prereq.is_completed ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <LockClosedIcon className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    <span className={prereq.is_completed ? 'text-gray-900' : 'text-gray-500'}>
                      Level {prereq.order_index}: {prereq.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Rewards section */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Rewards</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-md shadow-sm">
                <p className="text-sm text-gray-500">XP Reward</p>
                <p className="text-2xl font-bold text-indigo-600">{level.xp_reward}</p>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm">
                <p className="text-sm text-gray-500">Coin Reward</p>
                <p className="text-2xl font-bold text-yellow-600">{level.coin_reward}</p>
              </div>
            </div>
          </div>
          
          {/* Action button */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <ActionButton />
          </div>
        </div>
      </div>
      
      {/* Level completion modal */}
      <LevelCompletionModal
        isOpen={isCompletionModalOpen}
        onClose={() => setIsCompletionModalOpen(false)}
        levelTitle={level.title}
        levelNumber={level.order_index}
        completionData={completionData}
        nextLevelId={level.next_level}
      />
    </div>
  );
} 