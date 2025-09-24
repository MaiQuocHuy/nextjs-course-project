import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Users, Mail } from 'lucide-react';
import { Students } from '@/types/instructor/students';
import { useGetEnrolledStudentsQuery } from '@/services/instructor/students/students-ins-api';
import { EnrolledStudentList } from './EnrolledStudentList';
import { ErrorComponent } from '../commom/ErrorComponent';
import { StudentSkeleton } from './skeletons/index';
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

  // Fetch enrolled students
  const {
    data: enrolledStudents,
    isLoading: isLoadingEnrolledStudents,
    error: enrolledStudentsError,
  } = useGetEnrolledStudentsQuery({
    page: currentPage,
    size: itemsPerPage,
  });

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
      <div>
        <h1 className="text-3xl font-bold">Students</h1>
        <p className="text-muted-foreground">
          Manage and communicate with your students
        </p>
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
    </div>
  );
};
