import { MouseEventHandler, useEffect, useRef, useState } from 'react';
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
} from '@/services/instructor/courses-api';
import { Course } from '@/types/instructor/courses';
import { useGetCategoriesQuery } from '@/services/coursesApi';
import { useRouter } from 'next/navigation';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import { loadingAnimation } from '@/utils/instructor/loading-animation';
import { toast } from 'sonner';
import WarningAlert from '../commom/WarningAlert';
import {
  getCourseStatus,
  getStatusColor,
} from '@/utils/instructor/course/handle-course-status';

const coursesParams = {
  page: 0,
  size: 12,
  sort: 'createdAt,DESC',
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

  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const {
    data: courses,
    isLoading: isFetchingCourses,
    isError: isFetchCoursesError,
    error: errorFetchCourse,
  } = useGetCoursesQuery(coursesParams);
  const {
    data: categories,
    isLoading: isFetchingCategories,
    isError: isFetchCategoriesError,
    error: errorFetchCategories,
  } = useGetCategoriesQuery();
  const [deleteCourse] = useDeleteCourseMutation();

  // Loading animation
  useEffect(() => {
    if (isFetchingCourses || isFetchingCategories) {
      loadingAnimation(true, dispatch);
    } else {
      loadingAnimation(false, dispatch);
    }

    return () => {
      loadingAnimation(false, dispatch);
    };
  }, [isFetchingCourses, isFetchingCategories]);

  useEffect(() => {
    if (courses && courses.content && courses.content.length > 0) {
      setFilterdCourses(courses.content);

      // Get course that have the most min and max price
      getPriceRange(courses.content);
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

  // const getStatusColor = (status: string) => {
  //   status = status.toLowerCase();
  //   switch (status) {
  //     case 'pending':
  //       return 'bg-yellow-400 text-slate-900';
  //     case 'unpublished':
  //       return 'bg-destructive text-white';
  //     default:
  //       // published
  //       return 'bg-green-500 text-white';
  //   }
  // };

  const getPriceRange = (courses: Course[]) => {
    const coursePrices = courses.map((course) => course.price);
    const minPrice = Math.min(...coursePrices);
    const maxPrice = Math.max(...coursePrices);
    const newPriceRange = {
      minPrice,
      maxPrice,
      value: [minPrice, maxPrice],
    };
    initFilterValues.current.priceRange = newPriceRange;
    setFilters(initFilterValues.current);
  };

  const resetRangePrice = () => {
    const originPriceRage = initFilterValues.current.priceRange;
    handleFilterCourse('priceRange', originPriceRage.value);
  };

  const handleFilterCourse = (filterField: string, value: any) => {
    // console.log(filterField, value);
    setFilters((prev) => {
      // Set value for price range filter
      if (Array.isArray(value)) {
        value = { ...prev.priceRange, value };
      }
      return { ...prev, [filterField]: value };
    });
  };

  const handleClearFilters = () => {
    setFilters(initFilterValues.current);
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      setIsDeleteDialogOpen(false);
      loadingAnimation(true, dispatch, 'Deleting course. Please wait...');
      const res = await deleteCourse(id);
      if (res) {
        setTimeout(() => {
          loadingAnimation(false, dispatch);
          toast.error('Delete course successfully!');
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      loadingAnimation(false, dispatch);
      toast.error('Delete course failed!');
    }
  };

  if (isFetchingCourses || isFetchingCategories) {
    return <></>;
  }

  if (errorFetchCourse || errorFetchCategories) {
    return <p className="text-red-500 font-semibold">Error!</p>;
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
                value={filters.searchTerm}
                onChange={(e) =>
                  handleFilterCourse('searchTerm', e.target.value)
                }
                className="pl-10"
              />
            </div>

            {/* Filter by status and category */}
            <div className="flex gap-2">
              {/* Filter by status */}
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterCourse('status', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="unpublished">Unpublished</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              {/* Filter by category */}
              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterCourse('category', value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories &&
                    categories.length > 0 &&
                    categories.map((category) => {
                      return (
                        <SelectItem
                          key={category.id}
                          value={category.name.toLowerCase()}
                          className="capitalize"
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
                {/* Rating */}
                <div>
                  <label className="text-sm font-medium">Rating</label>
                  <Select
                    value={filters.rating?.toString()}
                    onValueChange={(value) =>
                      handleFilterCourse('rating', parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All stars" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">All stars</SelectItem>
                      <SelectItem value="5">5 stars</SelectItem>
                      <SelectItem value="4">4+ stars</SelectItem>
                      <SelectItem value="3">3+ stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filter by price */}
                <div className="flex-1 max-w-[300px]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium ">Price Range</span>
                    <Button variant="outline" onClick={resetRangePrice}>
                      Reset
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/5 text-primary px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm border border-primary/20">
                      ${filters.priceRange.value[0]}
                    </span>
                    <span className="text-muted-foreground">-</span>
                    <span className="bg-primary/5 text-primary px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm border border-primary/20">
                      ${filters.priceRange.value[1]}
                    </span>
                  </div>

                  <SliderPrimitive.Root
                    className={cn(
                      'relative flex w-full touch-none select-none items-center my-3'
                    )}
                    value={filters.priceRange.value}
                    onValueChange={(value) =>
                      handleFilterCourse('priceRange', value)
                    }
                    max={filters.priceRange.maxPrice}
                    min={filters.priceRange.minPrice}
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
                    <span>${filters.priceRange.minPrice}</span>
                    <span>${filters.priceRange.maxPrice}</span>
                  </div>
                </div>

                {/* Filter by Date */}
                <div>
                  <label className="text-sm font-medium">Created Date</label>
                  <Select
                    value={filters.date}
                    onValueChange={(value) => handleFilterCourse('date', value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Latest Date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">Latest Date</SelectItem>
                      <SelectItem value="oldest">Oldest Date</SelectItem>
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
      {filteredCourses && filteredCourses.length > 0 ? (
        <div className="space-y-2">
          {/* Total courses */}
          <div>
            <span className="text-base">Total Courses:</span>{' '}
            <span className="text-lg font-semibold">
              {filteredCourses ? filteredCourses.length : 0}
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                className="shadow-card cursor-pointer hover:shadow-elegant transition-shadow"
                onClick={() => router.push(`/instructor/courses/${course.id}`)}
              >
                <div className="relative">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <span
                    className={`absolute top-3 left-3 px-2 py-1 rounded text-sm font-semibold capitalize ${getStatusColor(
                      getCourseStatus(course.statusReview)
                    )}`}
                  >
                    {getCourseStatus(course.statusReview)}
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
                  <CardTitle className="line-clamp-2">{course.title}</CardTitle>
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
