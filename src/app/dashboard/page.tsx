'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthProvider';

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoading, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex space-x-4">
              <Link 
                href="/dashboard/profile"
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Profile Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sign Out
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Profile
            </h2>
            {user ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="mb-2">
                  <span className="font-medium">Email:</span> {user.email}
                </div>
                <div className="mb-2">
                  <span className="font-medium">ID:</span> {user.id}
                </div>
                {user.user_metadata && (
                  <div className="mb-2">
                    <span className="font-medium">Name:</span>{' '}
                    {user.user_metadata.full_name || user.user_metadata.name || 'Not provided'}
                  </div>
                )}
                <div className="mb-2">
                  <span className="font-medium">Last Sign In:</span>{' '}
                  {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}
                </div>
              </div>
            ) : (
              <div className="text-red-600">
                Not authenticated. Please{' '}
                <Link
                  href="/auth/signin"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 