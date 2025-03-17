import Image from 'next/image';
import SupabaseTest from '@/components/SupabaseTest';

export default function Home() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Welcome to Your Learning Journey</h2>

      {/* Supabase Connection Test */}
      <SupabaseTest />

      <p className="text-gray-600">
        Start exploring the platform by selecting a level or checking your progress in the skills
        dashboard.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-blue-50 p-6">
          <h3 className="mb-2 text-lg font-medium">Current Progress</h3>
          <p className="text-sm text-gray-600">Level 5 - Business Strategy</p>
          <div className="mt-4 h-2 rounded-full bg-blue-100">
            <div className="h-full w-3/4 rounded-full bg-blue-500"></div>
          </div>
        </div>
        <div className="rounded-lg bg-green-50 p-6">
          <h3 className="mb-2 text-lg font-medium">Skills Overview</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Leadership: 75%</li>
            <li>Marketing: 60%</li>
            <li>Finance: 45%</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
