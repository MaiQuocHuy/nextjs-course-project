import { useGetEnrolledStudentsQuery } from '@/services/instructor/courses/courses-api';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Users, Mail, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { CourseEnrolledStudent as CourseEnrolledStudentType } from '@/types/instructor/students';
import { ErrorComponent } from '../../commom/ErrorComponent';
import { StudentSkeleton } from '../../students/skeletons';
import { Pagination } from '@/components/common/Pagination';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CourseEnrolledStudent = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sort, setSort] = useState('createdAt,DESC');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<
    CourseEnrolledStudentType[]
  >([]);

  const { id } = useParams<{ id: string }>();

  const {
    data: enrolledStudents,
    isLoading,
    error,
    refetch,
  } = useGetEnrolledStudentsQuery(
    {
      courseId: id,
      page: currentPage,
      size: itemsPerPage,
      sort: sort,
    },
    { skip: !id }
  );

  // Update filtered students when data changes
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

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSort(value);
  };

  // Show loading state while fetching data
  if (isLoading) {
    return <StudentSkeleton />;
  }

  // Show error state if there's an error
  if (error) {
    return <ErrorComponent onRetry={() => refetch()} />;
  }

  if (enrolledStudents && enrolledStudents.content.length === 0) {
    return (
      <div className='p-12 text-center'>
        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No students enrolled</h3>
        <p className="text-muted-foreground">
          Students will appear here once they enroll in this course.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Enrolled Students</h1>
          <p className="text-muted-foreground">
            Manage students enrolled in this course
          </p>
        </div>
        <div className="flex gap-3">
          <Button>
            <Mail className="mr-2 h-4 w-4" />
            Message All
          </Button>
        </div>
      </div>

      {/* Search, Sort and Stats */}
      <Card className="shadow-card">
        <CardContent>
          <div className="max-w-3xl flex items-center gap-5 py-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students by name, email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Select value={sort} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt,DESC">
                    Recent Enrollment
                  </SelectItem>
                  <SelectItem value="createdAt,ASC">
                    Oldest Enrollment
                  </SelectItem>
                  <SelectItem value="progress,desc">
                    Highest Progress
                  </SelectItem>
                  <SelectItem value="progress,asc">Lowest Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-6 md:grid-cols-4"></div>

      {/* Students List */}
      {filteredStudents && filteredStudents.length > 0 ? (
        <div className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            {filteredStudents.map((student) => (
              <Link
                key={student.id}
                href={`/instructor/students/${student.id}`}
                target="_blank"
              >
                <Card className="shadow-card hover:shadow-elegant transition-shadow cursor-pointer">
                  <CardContent>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden">
                        <Image
                          src={
                            student.thumbnailUrl || '/images/default-avatar.jpg'
                          }
                          alt={student.name || 'Student Avatar'}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="56px"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {student.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {student.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 mb-3">
                      {/* Progress */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Course Progress</span>
                          <span>{Math.round(student.progress * 100)}%</span>
                        </div>
                        <Progress
                          value={student.progress * 100}
                          className="h-2"
                        />
                      </div>

                      {/* Enrollment Date */}
                      <div className="text-sm text-muted-foreground">
                        <span>Enrolled on: </span>
                        <span>
                          {new Date(student.enrolledAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-300">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="h-3 w-3" />
                        </Button>
                      </div>

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
            ))}
          </div>

          {enrolledStudents &&
            enrolledStudents.page &&
            enrolledStudents.page.totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                pageInfo={enrolledStudents.page}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            )}
        </div>
      ) : (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No students enrolled</h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? 'Try adjusting your search criteria.'
                : 'Students will appear here once they enroll in this course.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseEnrolledStudent;
