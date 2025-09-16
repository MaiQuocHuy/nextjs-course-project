'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useGetStudentDetailsQuery,
  useGetStudentQuizResultsQuery,
} from '@/services/instructor/students/students-ins-api';
import { ErrorComponent } from '../../commom/ErrorComponent';
import { EnrolledCourses } from './EnrolledCourses';
import { StudentInfo } from './StudentInfo';
import { StudentQuizResults } from './StudentQuizResults';
import { StudentDetailsSkeleton } from './StudentDetailsSkeleton';
import { Pagination } from '@/components/common/Pagination';

const defaultParams = {
  page: 0,
  size: 10,
  sort: 'completedAt,desc',
};

const StudentDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [enrolledCoursesPagination, setEnrolledCoursesPagination] =
    useState(defaultParams);
  const [quizScoresPagination, setQuizScoresPagination] =
    useState(defaultParams);

  const {
    data: studentDetails,
    isLoading: isLoadingStudentDetails,
    error: studentDetailsError,
  } = useGetStudentDetailsQuery(
    { studentId: id, ...enrolledCoursesPagination },
    { skip: !id }
  );

  const {
    data: quizResults,
    isLoading: isLoadingQuizResults,
    error: quizResultsError,
  } = useGetStudentQuizResultsQuery(
    { studentId: id, ...quizScoresPagination },
    { skip: !id }
  );

  if (isLoadingStudentDetails || isLoadingQuizResults) {
    return <StudentDetailsSkeleton />;
  }

  if (!studentDetails) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Student not found</h2>
          <p className="mt-2 text-muted-foreground">
            The student you're looking for doesn't exist or has been removed.
          </p>
          <Button
            className="mt-4"
            variant="secondary"
            onClick={() => router.back()}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Students List
          </Button>
        </div>
      </div>
    );
  }

  if (studentDetailsError || quizResultsError) {
    return <ErrorComponent />;
  }

  return (
    <div className="space-y-8 p-6">
      {/* Student Information */}
      <StudentInfo
        studentDetails={studentDetails}
        quizResults={quizResults?.content}
      />

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid grid-cols-2 w-full md:w-[400px] mb-4">
          <TabsTrigger value="courses">Enrolled Courses</TabsTrigger>
          <TabsTrigger value="quizzes">Quiz Results</TabsTrigger>
        </TabsList>

        {/* Enrolled Courses */}
        <TabsContent value="courses" className="space-y-6">
          {studentDetails.enrolledCourses.content.length > 0 && (
            <EnrolledCourses
              enrolledCourses={studentDetails.enrolledCourses.content}
            />
          )}

          {studentDetails.enrolledCourses.page.totalPages > 1 && (
            <Pagination
              currentPage={enrolledCoursesPagination.page}
              itemsPerPage={enrolledCoursesPagination.size}
              pageInfo={studentDetails.enrolledCourses.page}
              onPageChange={(page) => {
                setEnrolledCoursesPagination((prev) => ({
                  ...prev,
                  page,
                }));
              }}
              onItemsPerPageChange={(size) => {
                setEnrolledCoursesPagination((prev) => ({ ...prev, size }));
              }}
            />
          )}
        </TabsContent>

        {/* Quiz Results */}
        <TabsContent value="quizzes" className="space-y-6">
          <StudentQuizResults quizResults={quizResults?.content} />

          {quizResults && quizResults.page.totalPages > 1 && (
            <Pagination
              currentPage={quizScoresPagination.page}
              itemsPerPage={quizScoresPagination.size}
              pageInfo={quizResults?.page}
              onPageChange={(page) => {
                setQuizScoresPagination((prev) => ({
                  ...prev,
                  page,
                }));
              }}
              onItemsPerPageChange={(size) => {
                setQuizScoresPagination((prev) => ({ ...prev, size }));
              }}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDetailsPage;
