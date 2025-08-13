'use client';

import { useState } from 'react';
import { InstructorSidebar } from '@/components/instructor/layout/InstructorSidebar';
import { InstructorHeader } from '@/components/instructor/layout/InstructorHeader';
import { LoadingAnimation } from '@/components/instructor/LoadingAnimation';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, content } = useSelector(
    (state: RootState) => state.loadingAnima
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {isLoading && <LoadingAnimation content={content} />}
      <div className="min-h-screen bg-instructor-bg">
        <InstructorSidebar
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
          isLoading={isLoading}
        />
        <div className="lg:pl-72">
          <InstructorHeader
            onMenuClick={() => {
              if (isLoading === false) {
                setSidebarOpen(true);
              }
            }}
          />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </>
  );
}
