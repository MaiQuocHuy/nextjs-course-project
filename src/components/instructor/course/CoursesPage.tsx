import { useEffect, useRef, useState } from 'react';
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
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  useDeleteCourseMutation,
  useGetCoursesQuery,
} from '@/services/instructor/courses/courses-api';
import { Course, CoursesFilter } from '@/types/instructor/courses';
import { useGetCategoriesQuery } from '@/services/coursesApi';
import { useRouter } from 'next/navigation';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import { loadingAnimation } from '@/utils/instructor/loading-animation';
import { toast } from 'sonner';
import WarningAlert from '../commom/WarningAlert';
import { getStatusColor } from '@/utils/instructor/course/handle-course-status';
import { ErrorComponent } from '../commom/ErrorComponents';
import { CoursesSkeleton } from './CoursesSkeleton';
import { Pagination } from '@/components/common/Pagination';

const coursesParams: CoursesFilter = {
  page: 0,
  size: 10,
  sort: 'createdAt,DESC',
  minPrice: 0,
  maxPrice: 1000,
};

export const CoursesPage = () => {
  const initFilterValues = useRef({
    searchTerm: '',
    status: 'all',
    category: 'all',
    rating: 0,
    priceRange: {
      minPrice: 0,
      maxPrice: 1000,
      value: [0, 1000],
    },
    date: 'latest',
  });
  const [filteredCourses, setFilterdCourses] = useState<Course[]>();
  const [filters, setFilters] = useState(initFilterValues.current);
  const [showFilters, setShowFilters] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [filters2, setFilters2] = useState(coursesParams);
  const priceRangeInit = useRef({ isInit: false, minPrice: 0, maxPrice: 1000 });

  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const {
    data: courses,
    isLoading: isFetchingCourses,
    error: errorFetchCourse,
  } = useGetCoursesQuery(filters2);

  const {
    data: categories,
    isLoading: isFetchingCategories,
    error: errorFetchCategories,
  } = useGetCategoriesQuery();

  const [deleteCourse] = useDeleteCourseMutation();

  // Initialize price range when courses data is fetched
  useEffect(() => {
    if (
      courses &&
      courses.content &&
      courses.content.length > 0 &&
      !priceRangeInit.current.isInit
    ) {
      // Get course that have the most min and max price
      getPriceRange(courses.content);
      priceRangeInit.current.isInit = true;
    }
  }, [courses]);

  // Handle filters
  useEffect(() => {
    if (courses && courses.content && courses.content.length > 0) {
      let matchedCourses = [...courses.content] as Course[];

      // Search
      const searchTerm = filters.searchTerm.trim().toLowerCase();
      if (filters.searchTerm !== '') {
        matchedCourses = matchedCourses.filter(
          (course) =>
            course.title.toLowerCase().includes(searchTerm) ||
            course.description?.toLowerCase().includes(searchTerm)
        );
      }

      // Status
      // if (filters.status !== 'all') {
      //   if (filters.status === 'pending') {
      //     matchedCourses = matchedCourses.filter(
      //       (course) => course.approved === false
      //     );
      //   } else {
      //     matchedCourses = matchedCourses.filter(
      //       (course) =>
      //         course.approved && course.status.toLowerCase() === filters.status
      //     );
      //   }
      // }

      // Category
      if (filters.category !== 'all') {
        matchedCourses = matchedCourses.filter((course) => {
          const categories = course.categories.map((category: any) =>
            category.name.toLowerCase()
          );
          return categories.includes(filters.category);
        });
      }

      // Rating
      if (filters.rating !== 0) {
        matchedCourses = matchedCourses.filter((course) => {
          return course.averageRating >= filters.rating;
        });
      }

      // Price range
      const copyPriceRange = { ...filters.priceRange };
      if (
        copyPriceRange.value[0] !== copyPriceRange.minPrice ||
        copyPriceRange.value[1] !== copyPriceRange.maxPrice
      ) {
        const minPriceInput = copyPriceRange.value[0];
        const maxPriceInput = copyPriceRange.value[1];
        // Check if price's range is invalid
        if (
          minPriceInput < copyPriceRange.minPrice ||
          maxPriceInput > copyPriceRange.maxPrice
        ) {
          return;
        } else {
          // Get all courses that in range of minPriceInput and maxPriceInput
          matchedCourses = matchedCourses.filter(
            (course) =>
              course.price >= minPriceInput && course.price <= maxPriceInput
          );
        }
      }

      // Date
      if (filters.date === 'oldest') {
        orderCoursesByDate(matchedCourses, 'oldest');
      }

      setFilterdCourses(matchedCourses);
    }
  }, [filters]);

  const orderCoursesByDate = (course: Course[], value: string) => {
    if (value === 'latest') {
      return course.sort(
        (a, b) =>
          new Date(b.createdAt.split('T')[0]).getTime() -
          new Date(a.createdAt.split('T')[0]).getTime()
      );
    } else {
      return course.sort(
        (a, b) =>
          new Date(a.createdAt.split('T')[0]).getTime() -
          new Date(b.createdAt.split('T')[0]).getTime()
      );
    }
  };

  const getPriceRange = (courses: Course[]) => {
    const coursePrices = courses.map((course) => course.price);
    const minPrice = Math.min(...coursePrices);
    const maxPrice = Math.max(...coursePrices);
    priceRangeInit.current.minPrice = minPrice;
    priceRangeInit.current.maxPrice = maxPrice;

    setFilters2((prev) => ({
      ...prev,
      minPrice: minPrice,
      maxPrice: maxPrice,
    }));
  };

  const resetRangePrice = () => {
    const minPrice = priceRangeInit.current.minPrice;
    const maxPrice = priceRangeInit.current.maxPrice;
    handleFilterCourseWithPriceRange([minPrice, maxPrice]);
  };

  const handleFilterCourseWithStatus = (filterField: string, value: any) => {
    if (value === 'DRAFT') {
      filterField = 'isPublished';
      value = false;
    } else {
      setFilters2((prev) => ({ ...prev, isPublished: undefined }));
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

  const handleFilterCourseWithPriceRange = (value: any) => {
    const minPrice = value[0];
    const maxPrice = value[1];
    setFilters2((prev) => {
      return { ...prev, minPrice, maxPrice };
    });
  };

  const handleFilterCourse = (filterField: string, value: any) => {
    setFilters2((prev) => {
      if (value === 'ALL') {
        value = undefined;
      }
      return { ...prev, [filterField]: value };
    });
  };

  const handleClearFilters = () => {
    const minPrice = priceRangeInit.current.minPrice;
    const maxPrice = priceRangeInit.current.maxPrice;
    setFilters2({ ...coursesParams, minPrice, maxPrice });
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      setIsDeleteDialogOpen(false);
      loadingAnimation(true, dispatch, 'Deleting course. Please wait...');
      const res = await deleteCourse(id).unwrap();
      if (res.statusCode === 200) {
        loadingAnimation(false, dispatch);
        toast.error('Delete course successfully!');
      }
    } catch (error) {
      loadingAnimation(false, dispatch);
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
                value={filters2.search}
                onChange={(e) => handleFilterCourse('search', e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter by status and category */}
            <div className="flex gap-2">
              {/* Filter by status */}
              <Select
                value={
                  filters2.status
                    ? filters2.status
                    : filters2.isPublished === false
                    ? 'DRAFT'
                    : 'ALL'
                }
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
                  !filters2.categoryIds || filters2.categoryIds?.length === 0
                    ? 'ALL'
                    : filters2.categoryIds?.at(0)
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
                {filters2.minPrice !== undefined &&
                  filters2.maxPrice !== undefined && (
                    <div className="flex-1 max-w-[300px]">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium ">
                          Price Range
                        </span>
                        <Button variant="outline" onClick={resetRangePrice}>
                          Reset
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-primary/5 text-primary px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm border border-primary/20">
                          ${filters2.minPrice}
                        </span>
                        <span className="text-muted-foreground">-</span>
                        <span className="bg-primary/5 text-primary px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm border border-primary/20">
                          ${filters2.maxPrice}
                        </span>
                      </div>

                      <SliderPrimitive.Root
                        className={cn(
                          'relative flex w-full touch-none select-none items-center my-3'
                        )}
                        value={[filters2.minPrice, filters2.maxPrice]}
                        onValueChange={(value) =>
                          handleFilterCourseWithPriceRange(value)
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
                        <span>${filters2.minPrice}</span>
                        <span>${filters2.maxPrice}</span>
                      </div>
                    </div>
                  )}

                {/* Rating */}
                <div>
                  <label className="text-sm font-medium">Rating</label>
                  <Select
                    value={filters2.rating ? filters2.rating : 'ALL'}
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
                    value={filters2.level ? filters2.level : 'ALL'}
                    onValueChange={(value) => handleFilterCourse('level', value)}
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
                      <SelectItem value="INTERMEDIATE" className="cursor-pointer">
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
                    value={filters2.sort}
                    onValueChange={(value) => handleFilterCourse('sort', value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Latest Date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt,DESC" className='cursor-pointer'>Latest Date</SelectItem>
                      <SelectItem value="createdAt,ASC" className='cursor-pointer'>Oldest Date</SelectItem>
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
      {courses && courses.content.length > 0 ? (
        <div className="space-y-2">
          {/* Total courses */}
          <div>
            <span className="text-base">Total Courses:</span>{' '}
            <span className="text-lg font-semibold">
              {courses.content.length}
            </span>
          </div>

          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.content.map((course) => (
                <Card
                  key={course.id}
                  className="shadow-card cursor-pointer hover:shadow-elegant transition-shadow"
                  onClick={() =>
                    router.push(`/instructor/courses/${course.id}`)
                  }
                >
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
                            router.push(`/instructor/courses/${course.id}`);
                          }}
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>

                        {/* Button edit course */}
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/instructor/courses/${course.id}/edit-course`
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
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <CardHeader>
                    <CardTitle className="line-clamp-2">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 min-h-[40px]">
                      {course.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      {/* Categories */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {course.categories.slice(0, 2).map((category) => {
                            return (
                              <Badge key={category.id} variant="outline">
                                {category.name}
                              </Badge>
                            );
                          })}
                        </div>

                        {course.categories.length > 2 && <ArrowRight />}
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
                      <div
                        className={`flex items-center text-sm ${
                          course.averageRating > 0
                            ? 'justify-between'
                            : 'justify-end'
                        }`}
                      >
                        {course.averageRating > 0 && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>{course.averageRating}</span>
                          </div>
                        )}
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
                currentPage={filters2.page ? filters2.page : 0}
                itemsPerPage={filters2.size ? filters2.size : 10}
                pageInfo={courses.page}
                onPageChange={(page) => setFilters2({ ...filters2, page })}
                onItemsPerPageChange={(size) =>
                  setFilters2({ ...filters2, size })
                }
              />
            )}
          </div>
        </div>
      ) : (
        // No course found
        <Card className="shadow-card">
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-4">
              {filters.searchTerm ||
              filters.status !== 'all' ||
              filters.category !== 'all' ||
              filters.priceRange.value[0] !== 0 ||
              filters.priceRange.value[1] !== 500 ||
              filters.rating
                ? 'Try adjusting your search criteria or filters.'
                : 'Create your first course to get started.'}
            </p>
            {!filters.searchTerm &&
              filters.status === 'all' &&
              filters.category === 'all' &&
              filters.priceRange.value[0] === 0 &&
              filters.priceRange.value[1] === 500 &&
              !filters.rating && (
                <Link href="/instructor/courses/create">
                  <Button className="cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Course
                  </Button>
                </Link>
              )}
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
