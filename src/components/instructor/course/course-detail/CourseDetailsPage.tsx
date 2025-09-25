'use client';

import { useState } from 'react';

import CourseNavigation from './CourseNavigation';
import CourseOverview from './CourseOverview';
import CourseContentPage from './CourseContentPage';
import { CourseDetailsSections } from '@/types/instructor/courses/course-details';
import CourseEnrolledStudent from './CourseEnrolledStudent';
import CourseReviews from './CourseReviews';

interface CourseDetailsPageProps {
  isEdittingCourse?: boolean;
}

export default function CourseDetailsPage({
  isEdittingCourse,
}: CourseDetailsPageProps) {
  const [activeSection, setActiveSection] = useState<CourseDetailsSections>(
    CourseDetailsSections.overview
  );

  return (
    <div className="min-h-screen bg-background">
      <CourseNavigation
        activeSection={activeSection}
        onNavigate={setActiveSection}
      />

      <main className="container py-6 space-y-6">
        {activeSection === 'overview' && (
          <CourseOverview
            isEdittingCourse={isEdittingCourse ? isEdittingCourse : false}
          />
        )}

        {activeSection === 'content' && <CourseContentPage />}

        {activeSection === 'students' && <CourseEnrolledStudent />}

        {activeSection === 'reviews' && <CourseReviews />}
      </main>
    </div>
  );
}
