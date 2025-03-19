'use client';

import { useProgress } from '@/contexts/ProgressContext';
import { 
  CheckCircleIcon, 
  LockClosedIcon, 
  ClockIcon
} from '@heroicons/react/24/solid';
import { ProgressStatus } from '@/lib/supabase/types';

export default function LevelProgress() {
  const { levels, isLoading } = useProgress();
  
  if (isLoading || !levels.length) {
    return (
      <div className="animate-pulse">
        <div className="h-2 bg-gray-200 rounded w-full mb-3"></div>
        <div className="flex justify-between">
          <div className="h-5 bg-gray-200 rounded w-20"></div>
          <div className="h-5 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    );
  }
  
  // Calculate progress stats
  const totalLevels = levels.length;
  const completedLevels = levels.filter(level => level.status === ProgressStatus.COMPLETED).length;
  const inProgressLevels = levels.filter(level => level.status === ProgressStatus.IN_PROGRESS).length;
  const progressPercentage = Math.round((completedLevels / totalLevels) * 100);
  
  // Determine next level to complete
  const nextLevel = levels.find(level => 
    level.is_accessible && 
    (level.status === ProgressStatus.NOT_STARTED || level.status === ProgressStatus.IN_PROGRESS)
  );
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Your Progress</h3>
      
      {/* Progress bar */}
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div 
          className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      {/* Progress stats */}
      <div className="flex justify-between text-sm text-gray-600 mb-4">
        <div>{completedLevels} of {totalLevels} complete</div>
        <div>{progressPercentage}%</div>
      </div>
      
      {/* Level status indicators */}
      <div className="flex items-center space-x-4 text-sm">
        <div className="flex items-center">
          <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
          <span>Completed: {completedLevels}</span>
        </div>
        
        <div className="flex items-center">
          <ClockIcon className="h-4 w-4 text-blue-500 mr-1" />
          <span>In Progress: {inProgressLevels}</span>
        </div>
        
        <div className="flex items-center">
          <LockClosedIcon className="h-4 w-4 text-gray-500 mr-1" />
          <span>Locked: {totalLevels - completedLevels - inProgressLevels}</span>
        </div>
      </div>
      
      {/* Next level recommendation */}
      {nextLevel && (
        <div className="mt-4 p-3 bg-indigo-50 rounded-md border border-indigo-100">
          <p className="text-sm font-medium text-indigo-800">Next level to complete:</p>
          <p className="text-indigo-700">
            Level {nextLevel.order_index}: {nextLevel.title}
          </p>
        </div>
      )}
    </div>
  );
} 