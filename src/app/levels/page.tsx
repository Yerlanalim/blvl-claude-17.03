import { Metadata } from 'next';
import LevelMap from '@/components/levels/LevelMap';
import LevelProgress from '@/components/levels/LevelProgress';

export const metadata: Metadata = {
  title: 'Learning Path | BLVL',
  description: 'Explore your learning path and progress through our interactive levels',
};

export default function LevelsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Learning Path</h1>
        
        {/* Progress section */}
        <div className="mb-8">
          <LevelProgress />
        </div>
        
        {/* Level map */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">All Levels</h2>
          <p className="text-gray-600 mb-6">
            Select a level to start learning. Complete the current level to unlock the next one.
          </p>
          
          <LevelMap />
        </div>
      </div>
    </div>
  );
} 