import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/';

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
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

    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      // Check if a user record already exists in the database
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', data.user.id)
        .single();

      if (userError || !existingUser) {
        // Create a new user record if it doesn't exist
        const { error: profileError } = await supabase
          .from('users')
          .upsert({
            id: data.user.id,
            // Use user metadata for name, fall back to email if not available
            full_name: data.user.user_metadata?.full_name || 
                      data.user.user_metadata?.name || 
                      data.user.user_metadata?.preferred_username || 
                      data.user.email?.split('@')[0] || 'User',
            email: data.user.email?.toLowerCase(),
            avatar_url: data.user.user_metadata?.avatar_url,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          // Continue anyway, as authentication was successful
        }
      }
    }
  }

  // URL to redirect to after sign in
  return NextResponse.redirect(new URL(next, request.url));
}
