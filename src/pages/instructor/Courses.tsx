import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setSearchTerm, setFilters } from '@/store/slices/coursesSlice';
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

export const Courses = () => {
  const dispatch = useDispatch();
  const { courses, searchTerm, filters } = useSelector(
    (state: RootState) => state.courses
  );
  const [showFilters, setShowFilters] = useState(false);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filters.status === 'all' || course.status === filters.status;
    const matchesCategory =
      filters.category === 'all' || course.category === filters.category;
    const matchesRating = !filters.rating || course.rating >= filters.rating;
    const matchesPrice =
      course.price >= filters.priceRange[0] &&
      course.price <= filters.priceRange[1];

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCategory &&
      matchesRating &&
      matchesPrice
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'discontinued':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
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
        <Link href="/instructor/courses/create">
          <Button className="bg-gradient-primary shadow-elegant">
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses by name or ID..."
                value={searchTerm}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  dispatch(setFilters({ status: value }))
                }
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

              <Select
                value={filters.category}
                onValueChange={(value) =>
                  dispatch(setFilters({ category: value }))
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Programming">Programming</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
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

          {showFilters && (
            <div className="mt-4 p-4 border rounded-lg bg-muted/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Minimum Rating</label>
                  <Select
                    value={filters.rating?.toString() || ''}
                    onValueChange={(value) =>
                      dispatch(
                        setFilters({ rating: value ? parseFloat(value) : null })
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any rating</SelectItem>
                      <SelectItem value="4.5">4.5+ stars</SelectItem>
                      <SelectItem value="4.0">4.0+ stars</SelectItem>
                      <SelectItem value="3.5">3.5+ stars</SelectItem>
                      <SelectItem value="3.0">3.0+ stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Price Range</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange[0]}
                      onChange={(e) =>
                        dispatch(
                          setFilters({
                            priceRange: [
                              parseInt(e.target.value) || 0,
                              filters.priceRange[1],
                            ],
                          })
                        )
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange[1]}
                      onChange={(e) =>
                        dispatch(
                          setFilters({
                            priceRange: [
                              filters.priceRange[0],
                              parseInt(e.target.value) || 500,
                            ],
                          })
                        )
                      }
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() =>
                      dispatch(
                        setFilters({
                          status: 'all',
                          category: 'all',
                          rating: null,
                          priceRange: [0, 500],
                        })
                      )
                    }
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="shadow-card hover:shadow-elegant transition-shadow"
            >
              <div className="relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Badge
                  className={`absolute top-3 left-3 ${getStatusColor(
                    course.status
                  )}`}
                >
                  {course.status}
                </Badge>
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
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Course
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
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
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Category</span>
                    <Badge variant="outline">{course.category}</Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{course.studentsCount} students</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{course.lessonsCount} lessons</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-warning fill-current" />
                      <span>{course.rating || 'No rating'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(course.createdAt).toLocaleDateString()}
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
      ) : (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ||
              filters.status !== 'all' ||
              filters.category !== 'all'
                ? 'Try adjusting your search criteria or filters.'
                : 'Create your first course to get started.'}
            </p>
            {!searchTerm &&
              filters.status === 'all' &&
              filters.category === 'all' && (
                <Link href="/instructor/courses/create">
                  <Button className="bg-gradient-primary">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Course
                  </Button>
                </Link>
              )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
