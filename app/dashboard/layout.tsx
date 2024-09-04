
import Header from '@/components/layout/header';
import SessionHandle from '@/components/layout/session-handle';
import Sidebar from '@/components/layout/sidebar';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next Shadcn Dashboard Starter',
  description: 'Basic dashboard with Next.js and Shadcn'
};


export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex">
      <SessionHandle>
        <Sidebar />
        <main className="w-full flex-1 overflow-hidden">
          <Header />
          {children}
        </main>
      </SessionHandle>
    </div>
  );
}
