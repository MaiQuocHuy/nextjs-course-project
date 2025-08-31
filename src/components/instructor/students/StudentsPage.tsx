import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Users, Mail, BookOpen, TrendingUp } from 'lucide-react';
import { EnrolledCourse, Students } from '@/types/instructor/students';
import { useGetEnrolledStudentsQuery } from '@/services/instructor/students/students-ins-api';
import { EnrolledStudentList } from './EnrolledStudentList';
import { ErrorComponent } from '../commom/ErrorComponents';
import { StudentSkeleton } from './StudentSkeleton';
import { Pagination } from '../../common/Pagination';

const params = {
  page: 0,
  size: 10,
};

export const StudentsPage = () => {
  const [currentPage, setCurrentPage] = useState(params.page);
  const [itemsPerPage, setItemsPerPage] = useState(params.size);
  const [filteredStudents, setFilteredStudents] = useState<Students[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Students | null>(null);

  // Fetch enrolled students
  const {
    data: enrolledStudents,
    isLoading: isLoadingEnrolledStudents,
    error: enrolledStudentsError,
  } = useGetEnrolledStudentsQuery({
    page: currentPage,
    size: itemsPerPage,
  });
  console.log(enrolledStudents);

  useEffect(() => {
    if (enrolledStudents && enrolledStudents.content.length > 0) {
      setFilteredStudents(enrolledStudents.content);
    }
  }, [enrolledStudents]);

  // Handle search
  useEffect(() => {
    if (enrolledStudents && enrolledStudents.content.length > 0) {
      const students = enrolledStudents.content;
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
    }
  }, [searchTerm, enrolledStudents]);

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

  // Show loading state while fetching data
  if (isLoadingEnrolledStudents) {
    return <StudentSkeleton />;
  }

  // Show error state if there's an error
  if (enrolledStudentsError) {
    return <ErrorComponent />;
  }

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

        {enrolledStudents && enrolledStudents.content.length > 0 && (
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-4xl font-bold">
                    {enrolledStudents.content.length}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total Students
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Students List */}
      <div className="space-y-4">
        <EnrolledStudentList
          enrolledStudents={filteredStudents}
          searchTerm={searchTerm}
        />

        {enrolledStudents &&
          enrolledStudents.page &&
          enrolledStudents.page.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              pageInfo={enrolledStudents?.page}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          )}
      </div>

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
                    src={selectedStudent.thumbnailUrl}
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
