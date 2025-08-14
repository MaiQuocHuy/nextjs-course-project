'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch } from 'react-redux';

import {
  useGetCourseByIdQuery,
  useGetCoursesQuery,
} from '@/services/instructor/courses-api';
import { Course } from '@/types/instructor/courses';
import { CourseBasicInfoType } from '@/utils/instructor/create-course-validations/course-basic-info-validation';
import { loadingAnimation } from '@/utils/instructor/loading-animation';
import { AppDispatch } from '@/store/store';
import CourseNavigation from './CourseNavigation';
import CourseOverview from './CourseOverview';
import CourseContent from './CourseContent';

interface CourseDetailsPageProps {
  isEditCourse?: boolean;
}

const coursesParams = {
  page: 0,
  size: 12,
  sort: 'createdAt,DESC',
};

export default function CourseDetailsPage({
  isEditCourse,
}: CourseDetailsPageProps) {
  const [activeSection, setActiveSection] = useState<
    'overview' | 'content' | 'reviews'
  >('overview');
  const params = useParams<{ id: string }>();
  const {
    data: courseData,
    isLoading,
    isError,
  } = useGetCourseByIdQuery(params.id);

  const dispatch: AppDispatch = useDispatch();

  // Loading animation
  useEffect(() => {
    if (isLoading) {
      loadingAnimation(true, dispatch);
    } else {
      loadingAnimation(false, dispatch);
    }

    return () => {
      loadingAnimation(false, dispatch);
    };
  }, [isLoading]);

  if (isLoading) {
    return <></>;
  }

  if (isError) {
    return <div>Error loading course data</div>;
  }
  {
    return (
      <div className="min-h-screen bg-background">
        <CourseNavigation
          activeSection={activeSection}
          onNavigate={setActiveSection}
        />

        <main className="container py-6 space-y-6">
          {activeSection === 'overview' && (
            <CourseOverview
              courseData={courseData}
              isEditCourse={isEditCourse ? isEditCourse : false}
            />
          )}

          {activeSection === 'content' && courseData && (
            <CourseContent courseBasicInfo={courseData} />
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
