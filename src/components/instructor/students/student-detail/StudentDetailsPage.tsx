'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getStudentQuizResults } from '@/app/data/mockStudentDetail';
import { QuizResults } from '@/types/student';
import { useGetStudentDetailsQuery } from '@/services/instructor/students/students-ins-api';
import { ErrorComponent } from '../../commom/ErrorComponents';
import { EnrolledCourses } from './EnrolledCourses';
import { StudentInfo } from './StudentInfo';
import { StudentQuizResults } from './StudentQuizResults';
import { useQuizResults } from '@/hooks/student/useQuizResults';
import { StudentDetailsSkeleton } from './StudentDetailsSkeleton';

const StudentDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const {
    data: studentDetails,
    isLoading: isLoadingStudentDetails,
    error: studentDetailsError,
  } = useGetStudentDetailsQuery(id, { skip: !id });
  const {
    data: quizResults,
    isLoading: isLoadingQuizResults,
    error: quizResultsError,
  } = useQuizResults();

  // const [quizResults, setQuizResults] = useState<QuizResults[]>([]);
  // useEffect(() => {
  //   if (id) {
  //     const fetchedQuizResults = getStudentQuizResults();
  //     setQuizResults(fetchedQuizResults);
  //   }
  // }, [id]);

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
        // quizResults={quizResults}
      />

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid grid-cols-2 w-full md:w-[400px] mb-4">
          <TabsTrigger value="courses">Enrolled Courses</TabsTrigger>
          <TabsTrigger value="quizzes">Quiz Results</TabsTrigger>
        </TabsList>

        {/* Enrolled Courses */}
        <TabsContent value="courses" className="space-y-6">
          <EnrolledCourses enrolledCourses={studentDetails.enrolledCourses} />
        </TabsContent>

        {/* Quiz Results */}
        <TabsContent value="quizzes" className="space-y-6">
          <StudentQuizResults quizResults={quizResults?.content} />
          {/* <StudentQuizResults quizResults={quizResults} /> */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDetailsPage;
