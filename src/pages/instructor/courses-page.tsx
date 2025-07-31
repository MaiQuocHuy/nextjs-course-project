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
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Category,
  Course,
  getAllCourses,
  mockCategories,
} from '@/app/data/courses';

export const Courses = () => {
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
  const [courses, setCourses] = useState<Course[]>();
  const [filteredCourses, setFilterdCourses] = useState<Course[]>();
  const [categories, setCategories] = useState<Category[]>();
  const [filters, setFilters] = useState(initFilterValues.current);
  const [showFilters, setShowFilters] = useState(false);

  // Get all courses and categories
  useEffect(() => {
    const courses = getAllCourses();
    // Ordering courses by latest date as default
    const orderedCourses = orderCoursesByDate(courses, 'latest');
    setCourses(orderedCourses);

    setCategories(mockCategories);
  }, []);

  useEffect(() => {
    if (courses && courses.length > 0) {
      setFilterdCourses(courses);

      // Get course that have the most min and max price
      getPriceRange(courses);
    }
  }, [courses]);

  // Handle filters
  useEffect(() => {
    if (courses && courses.length > 0) {
      let matchedCourses = [...courses];

      // Search
      const searchTerm = filters.searchTerm.trim().toLowerCase();
      if (filters.searchTerm !== '') {
        matchedCourses = matchedCourses.filter(
          (course) =>
            course.title.toLowerCase().includes(searchTerm) ||
            course.description?.toLowerCase().includes(searchTerm) ||
            course.id.toLowerCase().includes(searchTerm)
        );
      }

      // Status
      if (filters.status !== 'all') {
        matchedCourses = matchedCourses.filter(
          (course) =>
            getCourseStatus(course.is_published, course.is_approved) ===
            filters.status
        );
      }

      // Category
      if (filters.category !== 'all') {
        matchedCourses = matchedCourses.filter((course) => {
          const categories = course.categories.map((category) =>
            category.name.toLowerCase()
          );
          return categories.includes(filters.category);
        });
      }

      // Rating
      if (filters.rating !== 0) {
        matchedCourses = matchedCourses.filter((course) => {
          return course.rating && course.rating === filters.rating;
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
          new Date(b.created_at.split('T')[0]).getTime() -
          new Date(a.created_at.split('T')[0]).getTime()
      );
    } else {
      return course.sort(
        (a, b) =>
          new Date(a.created_at.split('T')[0]).getTime() -
          new Date(b.created_at.split('T')[0]).getTime()
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-400 text-slate-900';
      case 'discontinued':
        return 'bg-destructive text-white';
      default:
        // published
        return 'bg-green-500 text-white';
    }
  };

  const getCourseStatus = (isPublished: boolean, isAproved: boolean) => {
    if (isAproved) {
      if (isPublished) {
        return 'published';
      } else {
        return 'discontinued';
      }
    } else {
      return 'pending';
    }
  };

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
                placeholder="Search courses by name, description or ID"
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="discontinued">Discontinued</SelectItem>
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
                      <SelectItem value="4">4 stars</SelectItem>
                      <SelectItem value="3">3 stars</SelectItem>
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
                className="shadow-card hover:shadow-elegant transition-shadow"
              >
                <div className="relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <span
                    className={`absolute top-3 left-3 px-2 py-1 rounded text-sm font-semibold capitalize ${getStatusColor(
                      getCourseStatus(course.is_published, course.is_approved)
                    )}`}
                  >
                    {getCourseStatus(course.is_published, course.is_approved)}
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
                      <DropdownMenuItem className="cursor-pointer">
                        <Eye className="mr-1 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Edit className="mr-1 h-4 w-4" />
                        Edit Course
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer"
                        variant="destructive"
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Delete Course
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <CardHeader>
                  <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    {/* Categories */}
                    <div className="flex flex-col gap-1 text-sm">
                      <span className="text-muted-foreground">Category</span>
                      <div>
                        {course.categories?.map((category) => {
                          return (
                            <Badge key={category.id} variant="outline">
                              {category.name}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{course.studentsCount} students</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{course.sections?.length} lessons</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{course.rating || 'No rating'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(course.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-2xl font-bold text-primary">
                        ${course.price}
                      </span>
                      <Link href={`/instructor/courses/${course.id}`}>
                        <Button variant="outline" size="sm">
                          View Course
                        </Button>
                      </Link>
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
    </div>
  );
};
