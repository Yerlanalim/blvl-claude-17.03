'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { checkSupabaseConnection } from '@/lib/supabase/check-connection';

export default function SupabaseTest() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;
    const connectionTimeout = setTimeout(() => {
      if (isMounted && isConnected === null) {
        setIsConnected(false);
        setError('Connection timeout. Supabase connection failed.');
      }
    }, 10000); // 10 second timeout

    async function testConnection() {
      try {
        // Use the simplified connection check
        const result = await checkSupabaseConnection();
        
        if (!isMounted) return;

        if (!result.success) {
          setError(result.error || 'Unknown error');
          setIsConnected(false);
          return;
        }

        setIsConnected(true);
        setError(null);
        setSession(result.session);

        // Now that we know the connection works, try to query users table
        // This is optional and just to show database connection status
        try {
          const { error: dbError } = await supabase
            .from('users')
            .select('*')
            .limit(1);
          
          if (dbError && isMounted) {
            console.warn('Database query failed:', dbError);
            // Don't set isConnected to false, because the auth connection works
            setError(prevError => prevError ? 
              `${prevError}. Database warning: ${dbError.message}` : 
              `Auth connected, but database query failed: ${dbError.message}`);
          }
        } catch (dbError) {
          console.warn('Database query error:', dbError);
        }
      } catch (error) {
        console.error('Unexpected connection error:', error);
        if (isMounted) {
          setIsConnected(false);
          setError(error instanceof Error ? error.message : 'Unknown error');
        }
      }
    }

    testConnection();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setSession(session);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(connectionTimeout);
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
      setError(`Logout Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

        {session && (
          <button
            onClick={handleSignOut}
            className="rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
          >
            Sign Out
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
