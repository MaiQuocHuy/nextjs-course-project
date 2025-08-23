import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Star,
  Calendar,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import { Course } from '@/app/data/courses';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { mockInstructorDashboardData } from '@/types/instructor/dashboard';

// Initialize stats with icons from mock data
const initStats = {
  totalCourses: {
    ...mockInstructorDashboardData.stats.totalCourses,
    icon: <BookOpen className="h-4 w-4 text-primary" />,
  },
  totalStudents: {
    ...mockInstructorDashboardData.stats.totalStudents,
    icon: <Users className="h-4 w-4 text-success" />,
  },
  totalRevenue: {
    ...mockInstructorDashboardData.stats.totalRevenue,
    icon: <DollarSign className="h-4 w-4 text-destructive" />,
  },
  avgRating: {
    ...mockInstructorDashboardData.stats.avgRating,
    icon: <Star className={`h-4 w-4 text-instructor-accent`} />,
  },
};

export const InsDashboard = () => {
  const [courses, setCourses] = useState<Course[]>(
    mockInstructorDashboardData.courses
  );
  const [publishedCourses, setPublishedCourses] = useState<Course[]>(
    mockInstructorDashboardData.publishedCourses
  );
  const [monthlyRevenue, setMonthlyRevenue] = useState(
    mockInstructorDashboardData.monthlyRevenue
  );
  const [notifications, setNotifications] = useState(
    mockInstructorDashboardData.notifications
  );
  const [stats, setStats] = useState(initStats);
  const [students, setStudents] = useState(
    mockInstructorDashboardData.students
  );

  // Single useEffect to initialize the component with mock data
  useEffect(() => {
    // No need to fetch data as we're using mock data directly
    // Just update the stats with icons
    setStats({
      totalCourses: {
        ...mockInstructorDashboardData.stats.totalCourses,
        icon: <BookOpen className="h-4 w-4 text-primary" />,
      },
      totalStudents: {
        ...mockInstructorDashboardData.stats.totalStudents,
        icon: <Users className="h-4 w-4 text-success" />,
      },
      totalRevenue: {
        ...mockInstructorDashboardData.stats.totalRevenue,
        icon: <DollarSign className="h-4 w-4 text-destructive" />,
      },
      avgRating: {
        ...mockInstructorDashboardData.stats.avgRating,
        icon: <Star className={`h-4 w-4 text-instructor-accent`} />,
      },
    });
  }, []);

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

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-card rounded-lg p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, {mockInstructorDashboardData.instructorName}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your courses today.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/instructor/courses/create">
              <Button className="bg-gradient-primary shadow-elegant">
                <BookOpen className="mr-2 h-4 w-4" />
                Create Course
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(stats).map((stat, index) => (
          <Link href={stat[1].href} key={index}>
            <Card key={stat[1].title} className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat[1].title}
                </CardTitle>
                <>{stat[1].icon}</>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat[1].value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat[1].description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Courses */}
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Courses</CardTitle>
            <CardDescription>Your latest course activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-0">
            {courses &&
              courses.length > 0 &&
              courses
                .slice(0, courses.length > 3 ? 3 : courses.length)
                .map((course) => (
                  <Link
                    href={`/instructor/courses/${course.id}`}
                    target='_blank'
                    key={course.id}
                    className="flex items-center px-6 py-2 gap-6 hover:bg-accent"
                  >
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 space-y-1">
                      <h4 className="text-sm font-medium">{course.title}</h4>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Badge
                          variant={
                            getCourseStatus(
                              course.is_published,
                              course.is_approved
                            ) === 'published'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {getCourseStatus(
                            course.is_published,
                            course.is_approved
                          )}
                        </Badge>
                        <span>•</span>
                        <span>{course.studentsCount} students</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${course.price}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Star className="mr-1 h-3 w-3 fill-current" />
                        {course.rating || 'N/A'}
                      </div>
                    </div>
                  </Link>
                ))}
            <Link href="/instructor/courses">
              <Button variant="outline" className="w-full mt-4 cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                View All Courses
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.length > 0 &&
              notifications
                .slice(0, notifications.length > 3 ? 3 : notifications.length)
                .map((notification) => (
                  <div key={notification.id} className="flex space-x-3">
                    <div
                      className={`h-2 w-2 rounded-full mt-2 ${
                        notification.isRead ? 'bg-muted' : 'bg-primary'
                      }`}
                    />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
            <Link href="/instructor/notifications">
              <Button variant="outline" className="w-full mt-4">
                <MessageSquare className="mr-2 h-4 w-4" />
                View All Notifications
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart and Recent Students */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>
              Your earnings over the last 3 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyRevenue.length > 0 &&
                monthlyRevenue
                  .slice(
                    0,
                    monthlyRevenue.length > 3 ? 3 : monthlyRevenue.length
                  )
                  .map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {item.month}/{item.year}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">
                          ${Math.floor(item.revenue)}
                        </span>
                        <TrendingUp className="h-4 w-4 text-success" />
                      </div>
                    </div>
                  ))}
            </div>
            <Link href="/instructor/earnings">
              <Button variant="outline" className="w-full mt-4 cursor-pointer">
                <DollarSign className="mr-2 h-4 w-4" />
                View Detailed Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Students */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Students</CardTitle>
            <CardDescription>New enrollments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {students.slice(0, 4).map((student) => (
              <div key={student.id} className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={student.avatar} alt={student.name} />
                  <AvatarFallback>
                    {student.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <h4 className="text-sm font-medium">{student.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {student.email}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {student.enrolledCourses.length} courses
                  </p>
                </div>
              </div>
            ))}
            <Link href="/instructor/students">
              <Button variant="outline" className="w-full mt-4 cursor-pointer">
                <Users className="mr-2 h-4 w-4" />
                View All Students
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
