'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useProgress } from '@/contexts/ProgressContext';
import LevelCard from './LevelCard';
import { LevelWithStatus } from '@/lib/supabase/types';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface LevelMapProps {
  activeLevel?: string | null;
}

export default function LevelMap({ activeLevel }: LevelMapProps) {
  const { levels, isLoading, error, refreshLevels } = useProgress();
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  
  // SVG container for drawing connections
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Function to handle click on a level card
  const handleLevelClick = (levelId: string) => {
    router.push(`/levels/${levelId}`);
  };
  
  // Function to calculate lines between levels
  useEffect(() => {
    if (!isClient || !levels.length || !containerRef.current || !svgRef.current) return;
    
    const levelEls = containerRef.current.querySelectorAll('[data-level-id]');
    if (!levelEls.length) return;
    
    // Clear existing lines
    const svg = svgRef.current;
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    
    // Map to store element positions by level ID
    const positions = new Map();
    
    // Get positions for all level elements
    levelEls.forEach((el) => {
      const levelId = el.getAttribute('data-level-id');
      if (!levelId) return;
      
      const rect = el.getBoundingClientRect();
      const containerRect = containerRef.current!.getBoundingClientRect();
      
      positions.set(levelId, {
        left: rect.left - containerRect.left + rect.width / 2,
        top: rect.top - containerRect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
      });
    });
    
    // Create lines for level prerequisites
    levels.forEach((level) => {
      const levelPos = positions.get(level.level_id);
      if (!levelPos) return;
      
      // Find level's prerequisites by checking all levels
      const prerequisites = levels.filter((l) => {
        // Linear path - previous level
        return l.order_index === level.order_index - 1;
      });
      
      // Draw lines to each prerequisite
      prerequisites.forEach((prereq) => {
        const prereqPos = positions.get(prereq.level_id);
        if (!prereqPos) return;
        
        // Create line element
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        
        // Starting point (prerequisite level)
        line.setAttribute('x1', String(prereqPos.left));
        line.setAttribute('y1', String(prereqPos.top + prereqPos.height / 2));
        
        // Ending point (current level)
        line.setAttribute('x2', String(levelPos.left));
        line.setAttribute('y2', String(levelPos.top - levelPos.height / 2));
        
        // Style based on accessibility and completion
        if (prereq.is_completed && level.is_accessible) {
          line.setAttribute('stroke', '#10B981'); // Green for completed path
          line.setAttribute('stroke-width', '3');
        } else if (level.is_accessible) {
          line.setAttribute('stroke', '#6366F1'); // Indigo for accessible path
          line.setAttribute('stroke-width', '2');
        } else {
          line.setAttribute('stroke', '#D1D5DB'); // Gray for locked path
          line.setAttribute('stroke-width', '2');
          line.setAttribute('stroke-dasharray', '5,5');
        }
        
        // Add line to SVG
        svg.appendChild(line);
      });
    });
  }, [levels, isClient, activeLevel]);
  
  // Refresh data button
  const handleRefresh = () => {
    refreshLevels();
  };
  
  // Show loading state
  if (isLoading && !levels.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ArrowPathIcon className="h-8 w-8 text-indigo-500 animate-spin mx-auto" />
          <p className="mt-2 text-gray-600">Loading level map...</p>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error && !levels.length) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <h3 className="text-red-800 font-medium">Error loading levels</h3>
        <p className="text-red-700 mt-1">{error}</p>
        <button
          onClick={handleRefresh}
          className="mt-3 inline-flex items-center px-3 py-1.5 border border-red-300 text-sm leading-5 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <ArrowPathIcon className="h-4 w-4 mr-1" />
          Retry
        </button>
      </div>
    );
  }
  
  // Sort levels by order index
  const sortedLevels = [...levels].sort((a, b) => a.order_index - b.order_index);
  
  return (
    <div className="relative py-8" ref={containerRef}>
      {/* SVG overlay for connecting lines */}
      <svg 
        ref={svgRef}
        className="absolute inset-0 pointer-events-none z-0"
        width="100%" 
        height="100%"
      ></svg>
      
      {/* Level grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {sortedLevels.map((level) => (
          <div key={level.level_id} data-level-id={level.level_id}>
            <LevelCard 
              level={level} 
              isActive={level.level_id === activeLevel}
              onClick={handleLevelClick}
            />
          </div>
        ))}
      </div>
      
      {/* Loading overlay */}
      {isLoading && levels.length > 0 && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-20">
          <ArrowPathIcon className="h-8 w-8 text-indigo-500 animate-spin" />
        </div>
      )}
    </div>
  );
} 