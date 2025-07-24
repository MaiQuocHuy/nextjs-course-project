'use client';

import { useState } from 'react';
import { InstructorSidebar } from '@/components/instructorDashboard/layout/InstructorSidebar';
import { InstructorHeader } from '@/components/instructorDashboard/layout/InstructorHeader';

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-instructor-bg">
      <InstructorSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      <div className="lg:pl-72">
        <InstructorHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
