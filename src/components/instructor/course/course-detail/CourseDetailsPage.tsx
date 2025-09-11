'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

import { useGetCourseByIdQuery } from '@/services/instructor/courses/courses-api';
import CourseNavigation from './CourseNavigation';
import CourseOverview from './CourseOverview';
import CourseContentPage from './CourseContentPage';
import CourseOverviewSkeleton from './skeletons/CourseOverviewSkeleton';
import { ErrorComponent } from '../../commom/ErrorComponent';

interface CourseDetailsPageProps {
  isEdittingCourse?: boolean;
}

export default function CourseDetailsPage({
  isEdittingCourse,
}: CourseDetailsPageProps) {
  const [activeSection, setActiveSection] = useState<
    'overview' | 'content' | 'reviews'
  >('overview');

  const params = useParams<{ id: string }>();

  const {
    data: courseData,
    isLoading,
    isError,
    refetch,
  } = useGetCourseByIdQuery(params.id, { skip: !params.id });

  if (isLoading) {
    return <CourseOverviewSkeleton />;
  }

  if (isError) {
    return (
      <ErrorComponent
        title="Error Loading Course"
        message="Failed to load course data. Please try again."
        onRetry={refetch}
      />
    );
  }

  if (courseData) {
    return (
      <div className="min-h-screen bg-background">
        <CourseNavigation
          activeSection={activeSection}
          onNavigate={setActiveSection}
        />

        <main className="container py-6 space-y-6">
          {activeSection === 'overview' && courseData && (
            <CourseOverview
              courseInfo={courseData}
              isEdittingCourse={isEdittingCourse ? isEdittingCourse : false}
              onRefetchData={refetch}
            />
          )}

          {activeSection === 'content' && courseData && (
            <CourseContentPage courseId={courseData.id} />
          )}

          {/* {activeSection === 'reviews' && params && (
          <CourseReviews
            averageRating={4.5}
            totalReviews={125}
            onViewAllReviews={() =>
              router.push(`/instructor/courses/${params.id}/reviews`)
            }
          />
        )} */}
        </main>
      </div>
    );
  }
}
