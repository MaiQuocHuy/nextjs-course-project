import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail } from 'lucide-react';
import { StudentDetails } from '@/types/instructor/students';
import type { QuizResults } from '@/types/student';

interface StudentInfoProps {
  studentDetails: StudentDetails;
  quizResults?: QuizResults[];
}

export const StudentInfo = ({
  studentDetails,
  quizResults,
}: StudentInfoProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={studentDetails.thumbnailUrl}
              alt={studentDetails.name}
            />
            <AvatarFallback>
              {studentDetails.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <h2 className="text-2xl font-bold">{studentDetails.name}</h2>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {studentDetails.email}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">
                  Enrolled Courses
                </span>
                <span className="font-medium text-lg">
                  {studentDetails.enrolledCourses.content.length}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">
                  Completed Quizzes
                </span>
                <span className="font-medium text-lg">
                  {quizResults?.length}
                </span>
              </div>
              {quizResults && quizResults.length > 0 && (
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    Avg. Quiz Score
                  </span>
                  <span className="font-medium text-lg">
                    {Math.round(
                      quizResults.reduce((sum, quiz) => sum + quiz.score, 0) /
                        quizResults.length
                    )}
                    %
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
