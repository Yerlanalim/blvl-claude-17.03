import { Metadata } from 'next';
import SupabaseTest from '@/components/SupabaseTest';

export const metadata: Metadata = {
  title: 'BizLevel',
  description: 'BizLevel - your business companion',
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SupabaseTest />
    </main>
  );
}
