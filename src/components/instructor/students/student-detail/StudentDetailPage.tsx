'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronLeft, Mail, BookOpen, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuizResultCard } from '@/components/dashboard-student/quiz-results/QuizResultCard';
import {
  getStudentById,
  getStudentQuizResults,
} from '@/app/data/mockStudentDetail';
import { Students } from '@/types/instructor/students';
import { QuizResults } from '@/types/student';
import { format } from 'date-fns';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy');
};

const ViewStudentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [student, setStudent] = useState<Students | undefined>(undefined);
  const [quizResults, setQuizResults] = useState<QuizResults[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // In a real app, this would be an API call
      const fetchedStudent = getStudentById(id as string);
      const fetchedQuizResults = getStudentQuizResults();

      setStudent(fetchedStudent);
      setQuizResults(fetchedQuizResults);
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!student) {
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

  return (
    <div className="space-y-8 p-6">
      {/* Back to Students List page */}
      {/* <div>
        <Button
          variant="ghost"
          className="pl-0 hover:bg-transparent hover:underline"
          onClick={() => router.push('/instructor/students')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Students List
        </Button>
      </div> */}

      {/* Student Information */}
      <div>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <Avatar className="h-24 w-24">
                <AvatarImage src={student.avatar} alt={student.name} />
                <AvatarFallback>
                  {student.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4 text-center md:text-left">
                <div>
                  <h2 className="text-2xl font-bold">{student.name}</h2>
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {student.email}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      Enrolled Courses
                    </span>
                    <span className="font-medium text-lg">
                      {student.enrolledCourses.length}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      Completed Quizzes
                    </span>
                    <span className="font-medium text-lg">
                      {quizResults.length}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      Avg. Quiz Score
                    </span>
                    <span className="font-medium text-lg">
                      {quizResults.length > 0
                        ? Math.round(
                            quizResults.reduce(
                              (sum, quiz) => sum + quiz.score,
                              0
                            ) / quizResults.length
                          )
                        : 'N/A'}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid grid-cols-2 w-full md:w-[400px] mb-4">
          <TabsTrigger value="courses">Enrolled Courses</TabsTrigger>
          <TabsTrigger value="quizzes">Quiz Results</TabsTrigger>
        </TabsList>

        {/* Enrolled Courses */}
        <TabsContent value="courses" className="space-y-6">
          <h3 className="text-xl font-semibold">Enrolled Courses</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {student.enrolledCourses.map((course) => (
              <Card
                key={course.courseId}
                className="overflow-hidden transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-video">
                  <img
                    src={
                      course.thumbnailUrl ||
                      'https://placehold.co/300x200?text=Course+Image'
                    }
                    alt={course.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-3">
                    <h4 className="text-sm font-medium truncate">
                      {course.title}
                    </h4>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="mb-3">
                    {course.categories?.map((category) => (
                      <Badge
                        key={category.id}
                        variant="secondary"
                        className="mr-1 mb-1"
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Progress
                      </span>
                      <span className="text-sm font-medium">
                        {Math.round(course.progress * 100)}%
                      </span>
                    </div>
                    <Progress value={course.progress * 100} className="h-2" />

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {course.level || 'Beginner'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {course.enrolledAt
                            ? formatDate(course.enrolledAt)
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Quiz Results */}
        <TabsContent value="quizzes" className="space-y-6">
          <h3 className="text-xl font-semibold">Quiz Results</h3>

          {quizResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizResults.map((quizResult) => (
                <QuizResultCard key={quizResult.id} quizResult={quizResult} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <BookOpen className="h-10 w-10 text-muted-foreground" />
                <h4 className="text-lg font-medium">No Quiz Results</h4>
                <p className="text-muted-foreground">
                  This student has not completed any quizzes yet.
                </p>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ViewStudentDetailPage;
