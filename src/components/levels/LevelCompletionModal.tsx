'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LevelCompletionResponse } from '@/lib/supabase/types';
import confetti from 'canvas-confetti';
import { 
  XMarkIcon,
  TrophyIcon,
  ArrowRightIcon,
  HomeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/solid';

interface LevelCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  levelTitle: string;
  levelNumber: number;
  completionData: LevelCompletionResponse | null;
  nextLevelId?: string | null;
}

export default function LevelCompletionModal({
  isOpen,
  onClose,
  levelTitle,
  levelNumber,
  completionData,
  nextLevelId
}: LevelCompletionModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();
  
  // Handle confetti animation when modal opens
  useEffect(() => {
    if (isOpen && !isAnimating) {
      setIsAnimating(true);
      
      // Fire confetti
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      
      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };
      
      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        
        const particleCount = 50 * (timeLeft / duration);
        
        // Since they fall down, start a bit higher than random
        confetti({
          particleCount,
          spread: 70,
          origin: { y: 0.2 }
        });
        
      }, 250);
    }
  }, [isOpen, isAnimating]);
  
  // Reset animation state when closed
  useEffect(() => {
    if (!isOpen) {
      setIsAnimating(false);
    }
  }, [isOpen]);
  
  // Handle navigation to next level
  const handleNextLevel = () => {
    if (nextLevelId) {
      onClose();
      router.push(`/levels/${nextLevelId}`);
    }
  };
  
  // Handle navigation to levels page
  const handleGoToLevels = () => {
    onClose();
    router.push('/levels');
  };
  
  // Handle replaying the same level
  const handleReplayLevel = () => {
    onClose();
    window.location.reload();
  };
  
  if (!isOpen) {
    return null;
  }
  
  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>
        
        {/* Modal content */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 sm:mx-0 sm:h-20 sm:w-20">
                <TrophyIcon className="h-10 w-10 text-yellow-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-2xl leading-6 font-bold text-gray-900 mt-2">
                  Level Completed!
                </h3>
                <div className="mt-2">
                  <p className="text-lg text-gray-700">
                    You've completed Level {levelNumber}: {levelTitle}
                  </p>
                  
                  {/* Rewards section */}
                  {completionData?.rewards && (
                    <div className="mt-4 p-4 bg-indigo-50 rounded-md">
                      <h4 className="text-lg font-medium text-indigo-800 mb-2">
                        Rewards Earned
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded-md shadow-sm">
                          <p className="text-gray-500 text-sm">XP Gained</p>
                          <p className="text-2xl font-bold text-indigo-600">
                            +{completionData.rewards.xp}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-md shadow-sm">
                          <p className="text-gray-500 text-sm">Coins Earned</p>
                          <p className="text-2xl font-bold text-yellow-600">
                            +{completionData.rewards.coins}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row gap-3">
            {nextLevelId ? (
              <button
                type="button"
                onClick={handleNextLevel}
                className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
              >
                <ArrowRightIcon className="h-5 w-5 mr-2" />
                Next Level
              </button>
            ) : null}
            
            <button
              type="button"
              onClick={handleGoToLevels}
              className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              All Levels
            </button>
            
            <button
              type="button"
              onClick={handleReplayLevel}
              className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Replay Level
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 