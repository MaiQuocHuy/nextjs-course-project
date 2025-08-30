import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Students } from '@/types/instructor/students';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface StudentStatisticsProps {
  enrolledStudents?: Students[];
}

export const StudentStatistics = ({
  enrolledStudents,
}: StudentStatisticsProps) => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Recent Students</CardTitle>
        <CardDescription>New enrollments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {enrolledStudents && enrolledStudents.length > 0 ? (
          <>
            {enrolledStudents
              .slice(
                0,
                enrolledStudents.length > 4 ? 4 : enrolledStudents.length
              )
              .map((student) => (
                <div key={student.id} className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={student.avatar} alt={student.name} />
                    <AvatarFallback>
                      {student.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-medium">{student.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {student.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {student.enrolledCourses.length} courses
                    </p>
                  </div>
                </div>
              ))}
            <Link href="/instructor/students">
              <Button variant="outline" className="w-full mt-4 cursor-pointer">
                <Users className="mr-2 h-4 w-4" />
                View All Students
              </Button>
            </Link>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No students enrolled</p>
        )}
      </CardContent>
    </Card>
  );
};
