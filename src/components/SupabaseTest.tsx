'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export default function SupabaseTest() {
  const [status, setStatus] = useState<string>('Checking connection...');
  const [session, setSession] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function checkConnection() {
      try {
        // Test database connection with a simple query
        const { data, error } = await supabase.from('users').select('*').limit(1);

        if (error) {
          if (error.code === 'PGRST116') {
            setStatus('Database connected but table "users" does not exist');
          } else {
            setStatus(`Database Error: ${error.message}`);
          }
          console.error('Database error:', error);
          return;
        }

        setStatus('Database connection successful!');
        console.log('Database response:', data);

        // Check authentication status
        const { data: sessionData } = await supabase.auth.getSession();
        setSession(sessionData.session);
      } catch (error) {
        setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error('Connection error:', error);
      }
    }

    checkConnection();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGithubLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('Auth error:', error);
        setStatus(`Auth Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      setStatus(`Login Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <h2 className="mb-4 text-xl font-bold">Supabase Connection Test</h2>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Connection Status:</h3>
          <p className={`mt-1 ${status.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
            {status}
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Authentication Status:</h3>
          <p className="mt-1">
            {session ? `Authenticated as: ${session.user.email}` : 'Not authenticated'}
          </p>
        </div>

        <button
          onClick={handleGithubLogin}
          className="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
        >
          Sign In with GitHub
        </button>
      </div>

      {/* Debug Info */}
      <div className="mt-4 rounded bg-gray-50 p-2 text-xs">
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(
            {
              url: process.env.NEXT_PUBLIC_SUPABASE_URL,
              hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}
