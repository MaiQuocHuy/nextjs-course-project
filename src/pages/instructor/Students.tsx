import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import {
  setSearchTerm,
} from '@/store/slices/studentsSlice';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Search,
  Users,
  MessageSquare,
  Mail,
  MoreVertical,
  Calendar,
  BookOpen,
  TrendingUp,
} from 'lucide-react';

export const Students = () => {
  const dispatch = useDispatch();
  const { students, searchTerm } = useSelector(
    (state: RootState) => state.students
  );
  const courses = useSelector((state: RootState) => state.courses.courses);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStudentCourses = (enrolledCourseIds: string[]) => {
    return courses.filter((course) => enrolledCourseIds.includes(course.id));
  };

  const getAverageProgress = (progress: Record<string, number>) => {
    const progressValues = Object.values(progress);
    return progressValues.length > 0
      ? progressValues.reduce((sum, value) => sum + value, 0) /
          progressValues.length
      : 0;
  };

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

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
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Send Email
          </Button>
          <Button className="bg-gradient-primary">
            <MessageSquare className="mr-2 h-4 w-4" />
            New Message
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
                placeholder="Search students by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <p className="text-2xl font-bold">{students.length}</p>
                <p className="text-xs text-muted-foreground">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      {filteredStudents.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student) => {
            const studentCourses = getStudentCourses(student.enrolledCourses);
            const averageProgress = getAverageProgress(student.progress);

            return (
              <Card
                key={student.id}
                className="shadow-card hover:shadow-elegant transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback>
                          {student.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {student.name}
                        </CardTitle>
                        <CardDescription>{student.email}</CardDescription>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => {
                                e.preventDefault();
                                setSelectedStudentId(student.id);
                              }}
                            >
                              View Details
                            </DropdownMenuItem>
                          </DialogTrigger>
                        </Dialog>
                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{student.enrolledCourses.length} courses</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(student.joinedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Overall Progress</span>
                      <span>{Math.round(averageProgress)}%</span>
                    </div>
                    <Progress value={averageProgress} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Enrolled Courses:</p>
                    <div className="flex flex-wrap gap-1">
                      {studentCourses.slice(0, 2).map((course) => (
                        <Badge
                          key={course.id}
                          variant="outline"
                          className="text-xs"
                        >
                          {course.title}
                        </Badge>
                      ))}
                      {studentCourses.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{studentCourses.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                      Last active:{' '}
                      {new Date(student.lastActive).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
          open={!!selectedStudentId}
          onOpenChange={() => setSelectedStudentId(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Student Details</DialogTitle>
              <DialogDescription>
                Detailed information about {selectedStudent.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
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
                <Card>
                  <CardContent className="p-4 text-center">
                    <BookOpen className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">
                      {selectedStudent.enrolledCourses.length}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Enrolled Courses
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-6 w-6 text-success mx-auto mb-2" />
                    <p className="text-2xl font-bold">
                      {Math.round(getAverageProgress(selectedStudent.progress))}
                      %
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Avg Progress
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-6 w-6 text-warning mx-auto mb-2" />
                    <p className="text-2xl font-bold">
                      {Math.floor(
                        (new Date().getTime() -
                          new Date(selectedStudent.joinedAt).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Days Enrolled
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Course Progress</h4>
                <div className="space-y-3">
                  {getStudentCourses(selectedStudent.enrolledCourses).map(
                    (course) => {
                      const progress = selectedStudent.progress[course.id] || 0;
                      return (
                        <div key={course.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {course.title}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {progress}%
                            </span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
                <Button variant="outline" className="flex-1">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
