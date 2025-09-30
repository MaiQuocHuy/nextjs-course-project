import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  Users,
  Star,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import * as SliderPrimitive from '@radix-ui/react-slider';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useDeleteCourseMutation,
  useGetCoursesQuery,
} from '@/services/instructor/courses/courses-api';
import { Course, CoursesFilter } from '@/types/instructor/courses/courses';
import { useGetCategoriesQuery } from '@/services/coursesApi';

import WarningAlert from '../commom/WarningAlert';
import { getStatusColor } from '@/utils/instructor/course/handle-course-status';
import { ErrorComponent } from '../commom/ErrorComponent';
import { CoursesSkeleton } from './skeletons/index';
import { CoursesGridSkeleton } from './skeletons/index';
import { useGetMinAndMaxPrice } from '@/hooks/instructor/useGetMinAndMaxPrice';
import { Pagination } from '@/components/common/Pagination';
import { getCourseLevelColor } from '@/utils/instructor/course/course-helper-functions';

const coursesParams: CoursesFilter = {
  page: 0,
  size: 10,
  sort: 'createdAt,DESC',
  minPrice: 0,
  maxPrice: 999.99,
  search: '',
};

export const CoursesPage = () => {
  const [filters, setFilters] = useState(coursesParams);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isGridLoading, setIsGridLoading] = useState(false);
  const priceRangeInit = useRef({
    isInit: false,
    minPrice: 0,
    maxPrice: 1000,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Local states for immediate UI updates
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minPrice || 0,
    filters.maxPrice || 999.99,
  ]);

  // Debounced values for API calls
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [debouncedPriceRange] = useDebounce(priceRange, 300);

  const router = useRouter();

  const {
    data: courses,
    isLoading: isFetchingCourses,
    error: errorFetchCourse,
  } = useGetCoursesQuery(filters);

  const {
    data: categories,
    isLoading: isFetchingCategories,
    error: errorFetchCategories,
  } = useGetCategoriesQuery();

  const [deleteCourse] = useDeleteCourseMutation();

  // Use the custom hook to calculate price range
  const { minPrice, maxPrice } = useGetMinAndMaxPrice(courses?.content || []);

  const getCourseStatus = useCallback(() => {
    if (filters.status) {
      return filters.status;
    } else {
      if (filters.isPublished === false) {
        return 'DRAFT';
      } else {
        return 'ALL';
      }
    }
  }, [filters.status, filters.isPublished]);

  useEffect(() => {
    if (errorFetchCourse || errorFetchCategories) {
      setIsGridLoading(false);
    }
  }, [errorFetchCourse, errorFetchCategories]);

  // Initialize price range when courses data is fetched
  useEffect(() => {
    if (courses) {
      // Stop loading when courses are fetched
      setIsGridLoading(false);

      if (
        courses.content &&
        courses.content.length > 0 &&
        !priceRangeInit.current.isInit
      ) {
        priceRangeInit.current.minPrice = minPrice;
        priceRangeInit.current.maxPrice = maxPrice;

        // Update local state for immediate UI updates only
        setPriceRange([minPrice, maxPrice]);

        setFilters((prev) => ({
          ...prev,
          minPrice: minPrice,
          maxPrice: maxPrice,
        }));
      }
    }
  }, [courses, minPrice, maxPrice]);

  // Check if any filter is applied
  useEffect(() => {
    if (
      filters.search ||
      getCourseStatus() !== 'ALL' ||
      (filters.categoryIds && filters.categoryIds.length > 0) ||
      filters.minPrice !== priceRangeInit.current.minPrice ||
      filters.maxPrice !== priceRangeInit.current.maxPrice ||
      filters.rating
    ) {
      setIsFiltering(true);
    } else {
      setIsFiltering(false);
    }
  }, [
    filters.search,
    getCourseStatus,
    filters.categoryIds,
    filters.minPrice,
    filters.maxPrice,
    filters.rating,
  ]);

  // Update filters with debounced search term
  useEffect(() => {
    setIsGridLoading(true);
    setFilters((prev) => ({
      ...prev,
      search: debouncedSearchTerm,
    }));
    if (debouncedSearchTerm === '') {
      setIsGridLoading(false);
    }
  }, [debouncedSearchTerm]);

  // Update filters with debounced price range
  useEffect(() => {
    if (priceRangeInit.current.maxPrice !== 1000) {
      // Prevent updating show grid on initial price range setup
      if (priceRangeInit.current.isInit) {
        setIsGridLoading(true);
        setFilters((prev) => ({
          ...prev,
          minPrice: debouncedPriceRange[0],
          maxPrice: debouncedPriceRange[1],
        }));
        if (
          debouncedPriceRange[0] === priceRangeInit.current.minPrice &&
          debouncedPriceRange[1] === priceRangeInit.current.maxPrice
        ) {
          setIsGridLoading(false);
        }
      } else {
        priceRangeInit.current.isInit = true;
      }
    }
  }, [debouncedPriceRange]);

  const resetRangePrice = () => {
    const minPrice = priceRangeInit.current.minPrice;
    const maxPrice = priceRangeInit.current.maxPrice;
    setPriceRange([minPrice, maxPrice]);
  };

  const handleFilterCourseWithStatus = (filterField: string, value: any) => {
    if (value === 'DRAFT') {
      filterField = 'isPublished';
      value = false;
      setFilters((prev) => ({ ...prev, status: undefined }));
    } else {
      setFilters((prev) => ({ ...prev, isPublished: undefined }));
    }
    handleFilterCourse(filterField, value);
  };

  const handleFilterCourseWithCategories = (
    filterField: string,
    value: any
  ) => {
    let categoryIds = [];
    if (value !== 'ALL') {
      categoryIds.push(value);
    }
    handleFilterCourse(filterField, categoryIds);
  };

  const handleFilterCourse = (filterField: string, value: any) => {
    setIsGridLoading(true);
    setFilters((prev) => {
      if (value === 'ALL') {
        value = undefined;
      }
      return { ...prev, [filterField]: value };
    });
  };

  const handleClearFilters = () => {
    const minPrice = priceRangeInit.current.minPrice;
    const maxPrice = priceRangeInit.current.maxPrice;

    // Reset local states
    setSearchTerm('');
    setPriceRange([minPrice, maxPrice]);

    // Explicitly clear all filter properties to ensure query refetch
    setFilters({
      ...coursesParams,
      minPrice,
      maxPrice,
    });
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      setIsDeleteDialogOpen(false);
      toast.info('Deleting course. Please wait...');
      const res = await deleteCourse(id).unwrap();
      if (res.statusCode === 200) {
        toast.success('Delete course successfully!');
      }
    } catch (error) {
      toast.error('Delete course failed!');
    }
  };

  if (isFetchingCourses || isFetchingCategories) {
    return <CoursesSkeleton />;
  }

  if (errorFetchCourse || errorFetchCategories) {
    return <ErrorComponent />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground">
            Manage your courses and create new ones
          </p>
        </div>
        <Link href="/instructor/courses/create-course">
          <Button className="cursor-pointer shadow-elegant">
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses by title or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter by status and category */}
            <div className="flex gap-2">
              {/* Filter by status */}
              <Select
                value={getCourseStatus()}
                onValueChange={(value) =>
                  handleFilterCourseWithStatus('status', value)
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL" className="cursor-pointer">
                    All Status
                  </SelectItem>
                  <SelectItem value="APPROVED" className="cursor-pointer">
                    Approved
                  </SelectItem>
                  <SelectItem value="PENDING" className="cursor-pointer">
                    Pending
                  </SelectItem>
                  <SelectItem value="DENIED" className="cursor-pointer">
                    Denied
                  </SelectItem>
                  <SelectItem value="RESUBMITTED" className="cursor-pointer">
                    Resubmitted
                  </SelectItem>
                  <SelectItem value="DRAFT" className="cursor-pointer">
                    Draft
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Filter by category */}
              <Select
                value={
                  !filters.categoryIds || filters.categoryIds?.length === 0
                    ? 'ALL'
                    : filters.categoryIds?.at(0)
                }
                onValueChange={(value) =>
                  handleFilterCourseWithCategories('categoryIds', value)
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  {categories &&
                    categories.length > 0 &&
                    categories.map((category) => {
                      return (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                          className="capitalize cursor-pointer"
                        >
                          {category.name}
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
          </div>

          {/* More filters */}
          {showFilters && (
            <div className="mt-4 p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between gap-4">
                {/* Filter by price */}
                {/*{priceRangeInit.current.isInit && (
                )}*/}
                <div className="flex-1 max-w-[300px]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium ">Price Range</span>
                    <Button variant="outline" onClick={resetRangePrice}>
                      Reset
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/5 text-primary px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm border border-primary/20">
                      ${priceRange[0]}
                    </span>
                    <span className="text-muted-foreground">-</span>
                    <span className="bg-primary/5 text-primary px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm border border-primary/20">
                      ${priceRange[1]}
                    </span>
                  </div>

                  <SliderPrimitive.Root
                    className={cn(
                      'relative flex w-full touch-none select-none items-center my-3'
                    )}
                    value={priceRange}
                    onValueChange={(value) =>
                      setPriceRange(value as [number, number])
                    }
                    min={priceRangeInit.current.minPrice}
                    max={priceRangeInit.current.maxPrice}
                    step={0.01}
                  >
                    <SliderPrimitive.Track
                      className="relative h-1 w-full grow overflow-hidden rounded-full bg-slider-track shadow-inner"
                      style={{
                        boxShadow: 'inset 0 1px 3px 0 rgb(0 0 0 / 0.1)',
                      }}
                    >
                      <SliderPrimitive.Range
                        className="absolute h-full rounded-full"
                        style={{
                          background:
                            'linear-gradient(135deg, hsl(var(--slider-range)), hsl(var(--slider-range) / 0.8))',
                          boxShadow:
                            '0 1px 3px 0 hsl(var(--slider-range) / 0.3)',
                        }}
                      />
                    </SliderPrimitive.Track>

                    <SliderPrimitive.Thumb
                      className="block h-4 w-4 rounded-full border-2 border-slider-thumb bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                      style={{
                        transition: 'var(--transition-smooth)',
                        boxShadow: 'var(--shadow-elegant)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.borderColor =
                          'hsl(var(--slider-thumb-hover))';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.borderColor =
                          'hsl(var(--slider-thumb))';
                      }}
                    />

                    <SliderPrimitive.Thumb
                      className="block h-4 w-4 rounded-full border-2 border-slider-thumb bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                      style={{
                        transition: 'var(--transition-smooth)',
                        boxShadow: 'var(--shadow-elegant)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.borderColor =
                          'hsl(var(--slider-thumb-hover))';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.borderColor =
                          'hsl(var(--slider-thumb))';
                      }}
                    />
                  </SliderPrimitive.Root>

                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="text-sm font-medium">Rating</label>
                  <Select
                    value={filters.rating ? filters.rating : 'ALL'}
                    onValueChange={(value) =>
                      handleFilterCourse('rating', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All stars" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL" className="cursor-pointer">
                        All stars
                      </SelectItem>
                      <SelectItem value="FIVE" className="cursor-pointer">
                        5 stars
                      </SelectItem>
                      <SelectItem value="FOUR" className="cursor-pointer">
                        4+ stars
                      </SelectItem>
                      <SelectItem value="THREE" className="cursor-pointer">
                        3+ stars
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filter by Levels */}
                <div>
                  <label className="text-sm font-medium">Levels</label>
                  <Select
                    value={filters.level ? filters.level : 'ALL'}
                    onValueChange={(value) =>
                      handleFilterCourse('level', value)
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL" className="cursor-pointer">
                        All Levels
                      </SelectItem>
                      <SelectItem value="BEGINNER" className="cursor-pointer">
                        Beginner
                      </SelectItem>
                      <SelectItem
                        value="INTERMEDIATE"
                        className="cursor-pointer"
                      >
                        Intermediate
                      </SelectItem>
                      <SelectItem value="ADVANCED" className="cursor-pointer">
                        Advanced
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filter by Date */}
                <div>
                  <label className="text-sm font-medium">Created Date</label>
                  <Select
                    value={filters.sort}
                    onValueChange={(value) => handleFilterCourse('sort', value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Latest Date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="createdAt,DESC"
                        className="cursor-pointer"
                      >
                        Latest Date
                      </SelectItem>
                      <SelectItem
                        value="createdAt,ASC"
                        className="cursor-pointer"
                      >
                        Oldest Date
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear filter */}
                <div className="flex items-end">
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Courses Grid */}
      {isGridLoading ? (
        <CoursesGridSkeleton />
      ) : courses && courses.content.length > 0 ? (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.content.map((course) => (
              <Card
                key={course.id}
                className="shadow-card cursor-pointer hover:shadow-elegant transition-shadow gap-4"
                onClick={() =>
                  window.open(`/instructor/courses/${course.id}`, '_blank')
                }
              >
                {/* Course's Thumbnail, Status and Actions*/}
                <div className="relative">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <span
                    className={`absolute top-3 left-3 px-2 py-1 rounded text-sm font-semibold capitalize ${getStatusColor(
                      course.statusReview
                    )}`}
                  >
                    {course.statusReview ? course.statusReview : 'Draft'}
                  </span>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-3 right-3 bg-white/90 hover:bg-white"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      {/* View course detail button */}
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(
                            `/instructor/courses/${course.id}`,
                            '_blank'
                          );
                        }}
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>

                      {!course.approved && (
                        <>
                          {/* Button edit course */}
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(
                                `/instructor/courses/${course.id}/edit-course`,
                                '_blank'
                              );
                            }}
                          >
                            <Edit className="mr-1 h-4 w-4" />
                            Edit Course
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />

                          {/* Button delete course */}
                          <DropdownMenuItem
                            className="cursor-pointer"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsDeleteDialogOpen(true);
                              setSelectedCourse(course);
                            }}
                          >
                            <Trash2 className="mr-1 h-4 w-4" />
                            Delete Course
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Title and Description */}
                <CardHeader>
                  <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2 min-h-[40px]">
                    {course.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3 border-t-1 pt-2">
                    {/* Levels */}
                    <Badge
                      variant="outline"
                      className={`text-white px-2 py-1 ${getCourseLevelColor(
                        course.level
                      )}`}
                    >
                      {course.level}
                    </Badge>

                    {/* Categories */}
                    <div className="flex items-center gap-2 border-t-1 pt-2">
                      <div className="flex items-center gap-1">
                        {course.categories.slice(0, 1).map((category) => {
                          return (
                            <Badge key={category.id} variant="outline">
                              {category.name}
                            </Badge>
                          );
                        })}
                      </div>

                      {course.categories.length > 1 && (
                        <Badge variant="default">{`+${
                          course.categories.length - 1
                        } more`}</Badge>
                      )}
                    </div>

                    {/* Total students and sections */}
                    <div className="flex items-center justify-between text-sm border-t-1 pt-2">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{`${course.totalStudents} student(s)`}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{course.sectionCount} section(s)</span>
                      </div>
                    </div>

                    {/* Rating and created date */}
                    <div className="flex items-center text-sm justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{course.averageRating}</span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(course.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Price and view detail course button */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-2xl font-bold text-primary">
                        {course.price > 0 ? '$' + course.price : 'Free'}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/instructor/courses/${course.id}`);
                        }}
                      >
                        View Course
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {courses && courses.page && courses.page.totalPages >= 1 && (
            <Pagination
              currentPage={filters.page ? filters.page : 0}
              itemsPerPage={filters.size ? filters.size : 10}
              pageInfo={courses.page}
              onPageChange={(page) => {
                setIsGridLoading(true);
                setFilters({ ...filters, page });
              }}
              onItemsPerPageChange={(size) => {
                setIsGridLoading(true);
                setFilters({ ...filters, size });
              }}
            />
          )}
        </div>
      ) : (
        // No course found
        <Card className="shadow-card">
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>

            {/* No courses found message */}
            <p className="text-muted-foreground mb-4">
              {isFiltering ? (
                'Try adjusting your search criteria or filters.'
              ) : (
                <Link href="/instructor/courses/create">
                  <Button className="cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Course
                  </Button>
                </Link>
              )}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Display warning message and handle delete course if can */}
      {selectedCourse && (
        <WarningAlert
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Are you sure you want to delete this course?"
          description="This action cannot be undone. This will permanently delete the
                          course and all its content."
          onClick={() => handleDeleteCourse(selectedCourse.id)}
          actionTitle="Delete Course"
        />
      )}
    </div>
  );
};
