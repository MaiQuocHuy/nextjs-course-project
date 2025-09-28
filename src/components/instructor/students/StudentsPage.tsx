import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Users } from 'lucide-react';

import {
  useGetEnrolledStudentsQuery,
  useGetNumOfEnrolledStudentsQuery,
} from '@/services/instructor/students/students-ins-api';
import { EnrolledStudentList } from './EnrolledStudentList';
import { ErrorComponent } from '../commom/ErrorComponent';
import {
  StudentPageSkeleton,
  StudentsListSkeleton,
} from './StudentPageSkeletons';
import { Pagination } from '../../common/Pagination';
import { useDebounce } from '@/hooks/useDebounce';

const defaultParams = {
  page: 0,
  size: 10,
};

export const StudentsPage = () => {
  const [currentPage, setCurrentPage] = useState(defaultParams.page);
  const [itemsPerPage, setItemsPerPage] = useState(defaultParams.size);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [searchDebounce] = useDebounce(searchTerm, 300);

  // Memoize API params to avoid unnecessary re-fetches
  const apiParams = useMemo(() => {
    return {
      page: currentPage,
      size: itemsPerPage,
      search: searchDebounce.trim() === '' ? undefined : searchDebounce.trim(),
    };
  }, [currentPage, itemsPerPage, searchDebounce]);

  // Fetch enrolled students
  const {
    data: enrolledStudents,
    isLoading: isLoadingEnrolledStudents,
    error: enrolledStudentsError,
  } = useGetEnrolledStudentsQuery(apiParams);

  // Get total number of enrolled students
  const {
    data: numOfEnrolledStudents,
    isLoading: isLoadingNumOfEnrolledStudents,
    error: numOfEnrolledStudentsError,
  } = useGetNumOfEnrolledStudentsQuery();

  useEffect(() => {
    if (searchDebounce.trim() !== '') {
      setIsFiltering(true);
      setIsSearching(true);
      setCurrentPage(0); // Reset to first page on search
    }
  }, [searchDebounce]);

  useEffect(() => {
    setIsFiltering(true);
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    if (enrolledStudents) {
      setIsFiltering(false);
      setIsSearching(false);
    }
  }, [enrolledStudents]);

  // Show loading state while fetching data
  if (isLoadingEnrolledStudents || isLoadingNumOfEnrolledStudents) {
    return <StudentPageSkeleton />;
  }

  // Show error state if there's an error
  if (enrolledStudentsError || numOfEnrolledStudentsError) {
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
            <div className="relative ">
              <i className="absolute left-3 top-3">
                {isSearching ? (
                  <Loader2 className="animate-spin h-4 w-4 text-muted-foreground" />
                ) : (
                  <Search className="h-4 w-4 text-muted-foreground" />
                )}
              </i>
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
                <p className="text-4xl font-bold">
                  {numOfEnrolledStudents || 0}
                </p>
                <p className="text-xs text-muted-foreground">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      {isFiltering ? (
        <StudentsListSkeleton />
      ) : (
        <div className="space-y-4">
          <EnrolledStudentList
            enrolledStudents={enrolledStudents?.content}
            searchTerm={searchDebounce}
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
      )}
    </div>
  );
};
