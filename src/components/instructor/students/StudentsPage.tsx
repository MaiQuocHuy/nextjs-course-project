import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Search,
  Users,
  MessageSquare,
  Mail,
  BookOpen,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { Course, getAllCourses } from '@/app/data/courses';
import {
  EnrolledCourse,
  mockStudents,
  Students,
} from '@/types/instructor/students';
import { useRouter } from 'next/navigation';

export const StudentsPage = () => {
  const [courses, setCourses] = useState<Course[]>();
  const [students, setStudents] = useState<Students[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Students[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Students | null>(null);

  const router = useRouter();

  // Get all students
  useEffect(() => {
    setStudents(mockStudents);
  }, []);

  // Get all courses
  useEffect(() => {
    const courses = getAllCourses();
    setCourses(courses);
  }, []);

  useEffect(() => {
    setFilteredStudents(students);
  }, [students]);

  useEffect(() => {
    if (searchTerm !== '') {
      const processedSearchTerm = searchTerm.trim().toLowerCase();
      setFilteredStudents(
        students.filter(
          (student) =>
            student.name.toLowerCase().includes(processedSearchTerm) ||
            student.email.toLowerCase().includes(processedSearchTerm)
        )
      );
    } else {
      setFilteredStudents(students);
    }
  }, [searchTerm, students]);

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground">
            Manage and communicate with your students
          </p>
        </div>
        <div className="flex gap-3">
          <Button>
            <Mail className="mr-2 h-4 w-4" />
            Send Email
          </Button>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="shadow-card md:col-span-3">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students by name, email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-4xl font-bold">{students.length}</p>
                <p className="text-xs text-muted-foreground">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      {filteredStudents.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
          {filteredStudents.map((student) => {
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
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
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

                    <div className="flex items-center justify-between pt-2 border-t border-gray-300">
                      {/* Chat and send email */}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* View detail information */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push(`/instructor/students/${student.id}`);
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

      {/* Student Details Dialog */}
      {selectedStudent && (
        <Dialog
          open={!!selectedStudent}
          onOpenChange={() => setSelectedStudent(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Student Details</DialogTitle>
              <DialogDescription>
                Detailed information about {selectedStudent.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Student Information */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={selectedStudent.avatar}
                    alt={selectedStudent.name}
                  />
                  <AvatarFallback className="text-lg">
                    {selectedStudent.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedStudent.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedStudent.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Student ID: {selectedStudent.id}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Enrolled cousers */}
                <Card>
                  <CardContent className="text-center">
                    <BookOpen className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">
                      {selectedStudent.enrolledCourses.length}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Enrolled Courses
                    </p>
                  </CardContent>
                </Card>

                {/* Avg progess */}
                <Card>
                  <CardContent className="text-center">
                    <TrendingUp className="h-6 w-6 text-success mx-auto mb-2" />
                    <p className="text-2xl font-bold">
                      {Math.round(
                        getAverageProgress(selectedStudent.enrolledCourses)
                      )}
                      %
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Avg Progress
                    </p>
                  </CardContent>
                </Card>

                {/* Days enrolled */}
                {/* <Card>
                  <CardContent className="text-center">
                    <Calendar className="h-6 w-6 text-warning mx-auto mb-2" />
                    <p className="text-2xl font-bold">
                      {Math.floor(
                        (new Date().getTime() -
                          new Date(selectedStudent.).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Days Enrolled
                    </p>
                  </CardContent>
                </Card> */}
              </div>

              {/* Progress */}
              <div>
                <h4 className="font-semibold mb-3">Course Progress</h4>
                <div className="space-y-3 h-[85px] overflow-y-auto">
                  {selectedStudent.enrolledCourses.map((course, index) => {
                    const progress =
                      course.progress > 0 ? course.progress * 100 : 0;
                    return (
                      <div key={course.courseId} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="mr-1 text-sm">{index + 1}.</span>
                            <span className="text-sm font-medium">
                              {course.title}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {progress}%
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </div>

              <Button variant="outline" className="flex-1">
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
