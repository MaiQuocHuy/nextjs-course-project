'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch } from 'react-redux';

import { useGetCoursesQuery } from '@/services/instructor/courses-api';
import { Course } from '@/types';
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
  const [courseData, setCourseData] = useState<CourseBasicInfoType>({
    file: null,
    title: '',
    description: '',
    price: 0,
    categoryIds: [''],
    level: '',
    id: '',
  });
  const [isFetchingCourse, setIsFetchingCourse] = useState(false);

  const { data: allCourses, isLoading: isFetchingCourses } =
    useGetCoursesQuery(coursesParams);
  const params = useParams<{ id: string }>();
  const dispatch: AppDispatch = useDispatch();

  // Loading animation
  useEffect(() => {
    if (isFetchingCourses || isFetchingCourse) {
      loadingAnimation(true, dispatch);
    } else {
      loadingAnimation(false, dispatch);
    }

    return () => {
      loadingAnimation(false, dispatch);
    };
  }, [isFetchingCourses, isFetchingCourse]);

  const getCourseDetail = useCallback(
    (allCourses: Course[], courseId: string) => {
      if (allCourses && allCourses.length > 0) {
        return allCourses.find((course) => course.id === courseId);
      }
      return null;
    },
    []
  );

  const createFileFromUrl = useCallback(
    async (url: string, fileName: string) => {
      const response = await fetch(url);
      // here image is url/location of image
      const blob = await response.blob();
      // courseData.file = new File([blob], fileName, { type: blob.type });
      return new File([blob], fileName, { type: blob.type });
    },
    []
  );

  const handleSetCourseData = useCallback(
    async (courseDataQuery: any) => {
      const courseData: CourseBasicInfoType = { ...courseDataQuery };
      if (courseDataQuery.category) {
        courseData.categoryIds = [courseDataQuery.category.id];
      }

      if (courseDataQuery.thumbnailUrl && courseDataQuery.title) {
        const imageFile = await createFileFromUrl(
          courseDataQuery.thumbnailUrl,
          courseDataQuery.title
        );
        courseData.file = imageFile;
      }
      setCourseData(courseData);
      setIsFetchingCourse(false);
    },
    [createFileFromUrl]
  );

  useEffect(() => {
    if (allCourses && allCourses.content && params) {
      setIsFetchingCourse(true);
      const courseDataQuery = getCourseDetail(allCourses.content, params?.id);
      if (courseDataQuery) {
        handleSetCourseData(courseDataQuery);
      } else {
        setIsFetchingCourse(false);
      }
    }
  }, [allCourses, params, getCourseDetail, handleSetCourseData]);

  if (isFetchingCourses || isFetchingCourse) {
    return <></>;
  }

  return (
    <div className="min-h-screen bg-background">
      <CourseNavigation
        activeSection={activeSection}
        onNavigate={setActiveSection}
      />

      <main className="container py-6 space-y-6">
        {activeSection === 'overview' && courseData && courseData.file && (
          <CourseOverview
            courseData={courseData}
            isEditCourse={isEditCourse ? isEditCourse : false}
          />
        )}

        {activeSection === 'content' && courseData && courseData.id && (
          <CourseContent courseId={courseData.id} />
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
