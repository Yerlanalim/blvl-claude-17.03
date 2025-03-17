'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';

export default function SupabaseTest() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function testConnection() {
      try {
        const { error } = await supabase.from('test').select('*').limit(1);
        
        if (error) {
          if (error.code === 'PGRST116') {
            setError('Database connected but table "test" does not exist');
          } else {
            setError(error.message);
          }
          setIsConnected(false);
          return;
        }

        setIsConnected(true);
        setError(null);

        // Check authentication status
        const { data: sessionData } = await supabase.auth.getSession();
        setSession(sessionData.session);
      } catch (error) {
        setIsConnected(false);
        setError(error instanceof Error ? error.message : 'Unknown error');
      }
    }

    testConnection();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

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
        setError(`Auth Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(`Login Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <h2 className="mb-4 text-xl font-bold">Supabase Connection Test</h2>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Connection Status:</h3>
          {isConnected === null ? (
            <p>Testing connection...</p>
          ) : isConnected ? (
            <p className="text-green-600">✅ Connected to Supabase</p>
          ) : (
            <div>
              <p className="text-red-600">❌ Failed to connect to Supabase</p>
              {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            </div>
          )}
        </div>

        <div>
          <h3 className="font-semibold">Authentication Status:</h3>
          <p className="mt-1">
            {session ? `Authenticated as: ${session.user.email}` : 'Not authenticated'}
          </p>
        </div>

        {!session && (
          <button
            onClick={handleGithubLogin}
            className="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
          >
            Sign In with GitHub
          </button>
        )}
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
