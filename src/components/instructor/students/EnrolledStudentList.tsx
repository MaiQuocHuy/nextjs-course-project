import Link from 'next/link';
import Image from 'next/image';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users } from 'lucide-react';
import { EnrolledCourse, Students } from '@/types/instructor/students';

interface EnrolledStudentListProps {
  enrolledStudents?: Students[];
  searchTerm: string;
}

export const EnrolledStudentList = ({
  enrolledStudents,
  searchTerm,
}: EnrolledStudentListProps) => {

  const getAverageProgress = (enrolledCourses: EnrolledCourse[]) => {
    const progressValues = enrolledCourses.map((course) => course.progress);
    return progressValues.length > 0
      ? (progressValues.reduce((sum, value) => {
          return sum + value;
        }, 0) *
          100) /
          progressValues.length
      : 0;
  };

  return (
    <>
      {enrolledStudents && enrolledStudents.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
          {enrolledStudents.map((student) => {
            const averageProgress = getAverageProgress(student.enrolledCourses);
            return (
              <Link
                key={student.id}
                href={`/instructor/students/${student.id}`}
                target="_blank"
              >
                <Card
                  key={student.id}
                  className=" shadow-card hover:shadow-elegant transition-shadow cursor-pointer"
                >
                  {/* Student's info */}
                  <CardHeader>
                    <div className="w-full h-48 relative rounded-t-lg overflow-hidden">
                      <Image
                        src={student.thumbnailUrl || '/images/default-avatar.jpg'}
                        alt={student.name || 'Student Avatar'}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={false}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{student.name}</CardTitle>
                      <CardDescription>{student.email}</CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="flex flex-col gap-4 mb-3">
                      {/* Progress */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Overall Progress</span>
                          <span>{Math.round(averageProgress)}%</span>
                        </div>
                        <Progress value={averageProgress} className="h-2" />
                      </div>

                      {/* Enrolled Courses */}
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium">Enrolled Courses:</p>
                        {student.enrolledCourses.length > 0 && (
                          <div className="flex flex-wrap gap-1 ">
                            {student.enrolledCourses
                              .slice(0, 1)
                              .map((course) => (
                                <Badge
                                  key={course.courseId}
                                  variant="outline"
                                  className="text-sm"
                                >
                                  {course.title}
                                </Badge>
                              ))}
                            {student.enrolledCourses.length > 2 && (
                              <Badge
                                key={`more-enrolled-courses-2`}
                                variant="secondary"
                                className="text-sm"
                              >
                                +{student.enrolledCourses.length - 1}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end pt-2 border-t border-gray-300">
                      {/* View detail information */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.open(
                            `/instructor/students/${student.id}`,
                            '_blank'
                          );
                        }}
                      >
                        View Student
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No students found</h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? 'Try adjusting your search criteria.'
                : 'Students will appear here once they enroll in your courses.'}
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
};
