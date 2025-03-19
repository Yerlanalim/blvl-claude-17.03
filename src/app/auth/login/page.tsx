import LoginForm from '@/components/auth/LoginForm';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function LoginPage() {
  // Check if user is already logged in
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.auth.getSession();
  
  // If user is already logged in, redirect to dashboard
  if (data?.session) {
    redirect('/dashboard');
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-12">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
} 