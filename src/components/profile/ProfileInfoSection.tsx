'use client';

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';
import Image from 'next/image';

type ProfileData = {
  id: string;
  email: string | undefined;
  name: string | null;
  avatar_url: string | null;
  level: number;
  xp: number;
  coins: number;
  created_at: string;
} | null;

export default function ProfileInfoSection({ user }: { user: User }) {
  const [profileData, setProfileData] = useState<ProfileData>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user profile from the "users" table
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setProfileData({
          id: user.id,
          email: user.email,
          name: data?.name || user.user_metadata?.full_name || user.user_metadata?.name || null,
          avatar_url: data?.avatar_url || user.user_metadata?.avatar_url || null,
          level: data?.level || 1,
          xp: data?.xp || 0,
          coins: data?.coins || 0,
          created_at: data?.created_at || user.created_at,
        });
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user, supabase]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-500">Loading profile data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-md p-4 mb-4">
        <div className="text-sm text-red-700">{error}</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="bg-yellow-50 rounded-md p-4 mb-4">
        <div className="text-sm text-yellow-700">
          No profile data found. Please update your profile.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row">
        <div className="flex-shrink-0 mr-6 mb-4 sm:mb-0">
          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100">
            {profileData.avatar_url ? (
              <Image
                src={profileData.avatar_url}
                alt="User avatar"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-500">
                <svg
                  className="w-16 h-16"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
          </div>
        </div>
        <div className="flex-grow">
          <h2 className="text-xl font-semibold text-gray-900">
            {profileData.name || 'Anonymous User'}
          </h2>
          <p className="text-sm text-gray-500">{profileData.email}</p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-indigo-50 rounded-lg p-3 text-center">
              <div className="text-lg font-semibold text-indigo-700">{profileData.level}</div>
              <div className="text-xs text-indigo-500">Level</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-lg font-semibold text-green-700">{profileData.xp}</div>
              <div className="text-xs text-green-500">Experience</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <div className="text-lg font-semibold text-yellow-700">{profileData.coins}</div>
              <div className="text-xs text-yellow-500">Coins</div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Account Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
          <div>
            <div className="text-sm font-medium text-gray-500">User ID</div>
            <div className="mt-1 text-sm text-gray-900">{profileData.id}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Account Created</div>
            <div className="mt-1 text-sm text-gray-900">
              {new Date(profileData.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 