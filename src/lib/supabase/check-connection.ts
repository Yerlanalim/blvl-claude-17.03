import { createBrowserClient } from '@supabase/ssr';

export async function checkSupabaseConnection() {
  try {
    console.log('Checking Supabase connection...');
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Test connection with auth.getSession which doesn't require database tables
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Supabase connection error:', error);
      return {
        success: false,
        error: error.message
      };
    }
    
    console.log('Supabase connection successful!');
    return {
      success: true,
      session: data.session
    };
  } catch (error) {
    console.error('Unexpected Supabase connection error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 