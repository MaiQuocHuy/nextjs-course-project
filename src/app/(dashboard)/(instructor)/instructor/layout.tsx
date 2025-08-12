'use client';

import { useState } from 'react';
import { InstructorSidebar } from '@/components/instructor/layout/InstructorSidebar';
import { InstructorHeader } from '@/components/instructor/layout/InstructorHeader';
import { LoadingOverlay } from '@/components/instructor/LoadingOverlay';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { Skeleton } from '@/components/ui/skeleton';

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useSelector((state: RootState) => state.loadingAnima);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {isLoading ? (
        <Skeleton className='w-screen h-screen'>
          <LoadingOverlay />
        </Skeleton>
      ) : (
        <>
          <div className="min-h-screen bg-instructor-bg">
            <InstructorSidebar
              open={sidebarOpen}
              onOpenChange={setSidebarOpen}
            />
            <div className="lg:pl-72">
              <InstructorHeader onMenuClick={() => setSidebarOpen(true)} />
              <main className="p-6">{children}</main>
            </div>
          </div>
        </>
      )}
    </>
  );
}
