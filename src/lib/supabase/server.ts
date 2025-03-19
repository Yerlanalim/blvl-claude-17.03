'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from './database.types';

/**
 * Creates a Supabase client for server components
 */
export const createServerSupabaseClient = () => {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
};

/**
 * Checks if the user is authenticated, for use in server components
 * @returns User object if authenticated, null otherwise
 */
export const getServerUser = async () => {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
};
