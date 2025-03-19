'use client';

import { useState, useRef, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';
import Image from 'next/image';

export default function AvatarUploadSection({ user }: { user: User }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        // Fetch user profile
        const { data, error } = await supabase
          .from('users')
          .select('avatar_url')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        const avatarUrl = data?.avatar_url || user.user_metadata?.avatar_url;
        setAvatarUrl(avatarUrl);
      } catch (error) {
        console.error('Error fetching avatar:', error);
      }
    };

    fetchAvatar();
  }, [user, supabase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({
        type: 'error',
        text: 'Please select an image file',
      });
      return;
    }

    // Create a preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadAvatar = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput?.files || fileInput.files.length === 0) {
      setMessage({
        type: 'error',
        text: 'Please select an image to upload',
      });
      return;
    }

    const file = fileInput.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    setUploading(true);
    setMessage(null);

    try {
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const avatarUrl = publicUrlData.publicUrl;

      // Update user_metadata in auth.users
      const { error: authError } = await supabase.auth.updateUser({
        data: { avatar_url: avatarUrl },
      });

      if (authError) throw authError;

      // Update profile in users table
      const { error: profileError } = await supabase
        .from('users')
        .upsert(
          {
            id: user.id,
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );

      if (profileError) throw profileError;

      setAvatarUrl(avatarUrl);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setMessage({
        type: 'success',
        text: 'Avatar updated successfully',
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setMessage({
        type: 'error',
        text: 'Error uploading avatar. Please try again.',
      });
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = async () => {
    if (!avatarUrl) return;

    setUploading(true);
    setMessage(null);

    try {
      // Try to get the file path from the URL
      const urlParts = avatarUrl.split('/');
      const bucket = urlParts[urlParts.length - 2];
      const filePath = urlParts[urlParts.length - 1];

      // Only attempt to delete if it's in our storage
      if (bucket === 'avatars') {
        // This may fail if the file doesn't exist, but we don't need to handle that
        await supabase.storage.from('avatars').remove([filePath]);
      }

      // Update user_metadata in auth.users
      const { error: authError } = await supabase.auth.updateUser({
        data: { avatar_url: null },
      });

      if (authError) throw authError;

      // Update profile in users table
      const { error: profileError } = await supabase
        .from('users')
        .update({
          avatar_url: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      setAvatarUrl(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setMessage({
        type: 'success',
        text: 'Avatar removed successfully',
      });
    } catch (error) {
      console.error('Error removing avatar:', error);
      setMessage({
        type: 'error',
        text: 'Error removing avatar. Please try again.',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        Profile Avatar
      </h3>

      {/* Notification Message */}
      {message && (
        <div
          className={`rounded-md p-4 ${
            message.type === 'success' ? 'bg-green-50' : 'bg-red-50'
          }`}
        >
          <div
            className={`text-sm ${
              message.type === 'success' ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {message.text}
          </div>
        </div>
      )}

      <div className="flex items-start space-x-8">
        {/* Current Avatar Display */}
        <div className="flex-shrink-0">
          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100">
            {(preview || avatarUrl) ? (
              <Image
                src={preview || avatarUrl || ''}
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

        {/* Avatar Upload Form */}
        <div className="flex-grow space-y-4">
          <div>
            <label
              htmlFor="avatar"
              className="block text-sm font-medium text-gray-700"
            >
              Upload New Avatar
            </label>
            <div className="mt-1 flex items-center space-x-4">
              <input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Recommended: Square image, at least 300x300 pixels, JPG or PNG
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={uploadAvatar}
              disabled={uploading || !preview}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Upload Avatar'}
            </button>

            {avatarUrl && (
              <button
                type="button"
                onClick={removeAvatar}
                disabled={uploading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-not-allowed"
              >
                {uploading ? 'Processing...' : 'Remove Avatar'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 