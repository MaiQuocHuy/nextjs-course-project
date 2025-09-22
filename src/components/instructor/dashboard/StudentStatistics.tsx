import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Students } from "@/types/instructor/students";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { EmptyState } from "@/components/instructor/commom/EmptyState";

interface StudentStatisticsProps {
  enrolledStudents?: Students[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const StudentStatistics = ({ enrolledStudents, onRefresh }: StudentStatisticsProps) => {
  return (
    <Card className="shadow-card gap-3">
      <CardHeader>
        <CardTitle>Recent Students</CardTitle>
        <CardDescription>New enrollments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        {enrolledStudents && enrolledStudents.length > 0 ? (
          <>
            {enrolledStudents
              .slice(0, enrolledStudents.length > 3 ? 3 : enrolledStudents.length)
              .map((student) => (
                <Link
                  href={`/instructor/students/${student.id}`}
                  target="_blank"
                  key={student.id}
                  className="flex items-center space-x-4 hover:bg-accent px-3 rounded-md min-h-[56px]"
                >
                  <Avatar>
                    <AvatarImage src={student.thumbnailUrl} alt={student.name} />
                    <AvatarFallback>
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-medium">{student.name}</h4>
                    <p className="text-xs text-muted-foreground">{student.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {student.enrolledCourses.length} courses
                    </p>
                  </div>
                </Link>
              ))}
            <Link href="/instructor/students">
              <Button variant="outline" className="w-full mt-4 cursor-pointer">
                <Users className="mr-2 h-4 w-4" />
                View All Students
              </Button>
            </Link>
          </>
        ) : (
          <EmptyState
            title="No students yet"
            message="No students have enrolled in your courses yet. Once you have enrollments, they will appear here."
            icon={<Users className="h-6 w-6 text-muted-foreground" />}
            showRetry={!!onRefresh}
            retryLabel="Refresh Students"
            onRetry={onRefresh}
            className="py-6"
          />
        )}
      </CardContent>
    </Card>
  );
};
