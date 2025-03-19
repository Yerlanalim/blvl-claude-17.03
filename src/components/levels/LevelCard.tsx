'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LevelWithStatus, ProgressStatus } from '@/lib/supabase/types';
import { 
  LockClosedIcon, 
  CheckCircleIcon, 
  PlayIcon, 
  ClockIcon,
  ChevronRightIcon
} from '@heroicons/react/24/solid';

interface LevelCardProps {
  level: LevelWithStatus;
  isActive?: boolean;
  onClick?: (levelId: string) => void;
}

export default function LevelCard({ level, isActive = false, onClick }: LevelCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine icon based on status
  const StatusIcon = () => {
    if (!level.is_accessible) {
      return <LockClosedIcon className="h-6 w-6 text-gray-500" />;
    }
    
    switch (level.status) {
      case ProgressStatus.COMPLETED:
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case ProgressStatus.IN_PROGRESS:
        return <ClockIcon className="h-6 w-6 text-blue-500" />;
      default:
        return <PlayIcon className="h-6 w-6 text-gray-700" />;
    }
  };
  
  // Determine background color based on status
  const getStatusBackgroundColor = () => {
    if (!level.is_accessible) {
      return 'bg-gray-200';
    }
    
    if (isActive) {
      return 'bg-indigo-50 ring-2 ring-indigo-500';
    }
    
    switch (level.status) {
      case ProgressStatus.COMPLETED:
        return 'bg-green-50';
      case ProgressStatus.IN_PROGRESS:
        return 'bg-blue-50';
      default:
        return 'bg-white';
    }
  };
  
  // Wrapper component - either a Link or div based on accessibility
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    if (!level.is_accessible) {
      return (
        <div 
          className="cursor-not-allowed"
          title="This level is locked. Complete previous levels to unlock."
        >
          {children}
        </div>
      );
    }
    
    if (onClick) {
      return (
        <div 
          className="cursor-pointer"
          onClick={() => onClick(level.level_id)}
        >
          {children}
        </div>
      );
    }
    
    return (
      <Link href={`/levels/${level.level_id}`}>
        {children}
      </Link>
    );
  };
  
  return (
    <Wrapper>
      <div
        className={`relative rounded-lg shadow-sm ${getStatusBackgroundColor()} transition-all duration-300 ${
          isHovered && level.is_accessible ? 'shadow-md scale-105' : ''
        } ${isActive ? 'shadow-md scale-105' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                level.is_accessible ? 'bg-white' : 'bg-gray-100'
              }`}>
                <StatusIcon />
              </div>
              <div>
                <h3 className={`text-lg font-medium ${!level.is_accessible ? 'text-gray-500' : 'text-gray-900'}`}>
                  Level {level.order_index}: {level.title}
                </h3>
                <p className={`text-sm ${!level.is_accessible ? 'text-gray-400' : 'text-gray-500'}`}>
                  {level.statusLabel}
                </p>
              </div>
            </div>
            {level.is_accessible && (
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
            )}
          </div>
          
          {/* Level thumbnail */}
          {level.thumbnail_url && (
            <div className="mt-4 relative h-24 w-full overflow-hidden rounded">
              <div className={`absolute inset-0 ${!level.is_accessible ? 'opacity-50' : ''}`}>
                <Image
                  src={level.thumbnail_url}
                  alt={level.title}
                  layout="fill"
                  objectFit="cover"
                  className={`transition-opacity duration-300 ${!level.is_accessible ? 'opacity-50 saturate-0' : ''}`}
                />
              </div>
            </div>
          )}
          
          {/* Level description - truncated */}
          <p className={`mt-2 text-sm line-clamp-2 ${!level.is_accessible ? 'text-gray-400' : 'text-gray-600'}`}>
            {level.description}
          </p>
          
          {/* Rewards section */}
          <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
              <span>XP: {level.xp_reward || '?'}</span>
            </div>
            <div className="flex items-center">
              <span>Coins: {level.coin_reward || '?'}</span>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
} 