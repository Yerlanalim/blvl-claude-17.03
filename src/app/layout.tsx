import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import MainLayout from '@/components/layout/MainLayout';
import { AuthProvider } from '@/lib/auth/AuthProvider';
import { ProgressProvider } from '@/contexts/ProgressContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BizLevel Platform',
  description: 'Game-based business education platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ProgressProvider>
            <MainLayout>{children}</MainLayout>
          </ProgressProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
