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
import {
  Course,
  getAllCourses,
  mockPayments,
  mockReviews,
  MonthlyRevenue,
  Notification,
} from '@/app/data/courses';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const initStats = {
  totalCourses: {
    title: 'Total Courses',
    value: 0,
    description: '',
    icon: <BookOpen className="h-4 w-4 text-primary" />,
    color: 'text-primary',
    href: '/instructor/courses',
  },
  totalStudents: {
    title: 'Total Students',
    value: 0,
    description: '+12% from last month',
    icon: <Users className="h-4 w-4 text-success" />,
    color: 'text-success',
    href: '/instructor/students',
  },
  totalRevenue: {
    title: 'Total Revenue',
    value: 0,
    description: '',
    icon: <DollarSign className="h-4 w-4 text-destructive" />,
    href: '/instructor/earnings',
  },
  avgRating: {
    title: 'Avg Rating',
    value: 0,
    description: 'Across all courses',
    icon: <Star className={`h-4 w-4 text-instructor-accent`} />,
    href: '/instructor/courses',
  },
};

export const Dashboard = () => {
  const [courses, setCourses] = useState<Course[]>();
  const [publishedCourses, setPublishedCourses] = useState<Course[]>();
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [ratings, setRatings] = useState(0);
  const [stats, setStats] = useState(initStats);

  // Get all courses
  useEffect(() => {
    const courses = getAllCourses();
    setCourses(courses);
  }, []);

  // Get published courses
  useEffect(() => {
    if (courses && courses.length > 0) {
      getPublishedCourses(courses);
    }
  }, [courses]);

  // Get total students and update courses & students staticstic
  useEffect(() => {
    if (publishedCourses && publishedCourses.length > 0) {
      // Get total students
      let totalStudents = 0;
      publishedCourses.map((course) => {
        if (course.studentsCount) {
          return (totalStudents += course.studentsCount);
        }
      });
      setTotalStudents(totalStudents);

      // Update courses & students staticstic
      const courseDes = publishedCourses.length + ' published';
      const stuDes = `+${12}% from last month`;
      setStats((prev) => ({
        ...prev,
        totalCourses: {
          ...prev.totalCourses,
          value: publishedCourses.length,
          description: courseDes,
        },
        totalStudents: {
          ...prev.totalStudents,
          value: totalStudents,
          description: stuDes,
        },
      }));
    }
  }, [publishedCourses]);

  // Get notifications
  useEffect(() => {
    // Call Api to get notifications
  }, []);

  // Get avg rating
  useEffect(() => {
    const reviews = mockReviews;
    let sum = 0;
    reviews.map((rate) => (sum += rate.rating));
    const avgRating = sum / reviews.length;
    setRatings(parseFloat(avgRating.toFixed(2)));
  }, []);

  // Get total and monthly revenue
  useEffect(() => {
    const payments = mockPayments;
    // Get total revenue
    let sum = 0;
    payments.map((pay) => {
      if (pay.status === 'COMPLETED') {
        sum += pay.amount;
      }
    });
    setTotalRevenue(sum);

    // Get monthly revenue
    const monthlyRevenue = new Array<MonthlyRevenue>();
    // Order payments by descending date
    const orderdPayments = payments.sort(
      (a, b) =>
        new Date(b.created_at.split('T')[0]).getTime() -
        new Date(a.created_at.split('T')[0]).getTime()
    );
    for (const pay of orderdPayments) {
      // Get last 3 months
      if (monthlyRevenue.length < 3) {
        if (pay.status === 'COMPLETED') {
          if (pay.paid_at) {
            // Get year and month
            const paidDate = new Date(pay.paid_at).toLocaleDateString();
            let seperator = '-';
            if (paidDate.includes('/')) {
              seperator = '/';
            }
            const year = parseInt(paidDate.split(seperator)[2]);
            const month = parseInt(paidDate.split(seperator)[1]);

            // Calculate revenue
            const item = {} as MonthlyRevenue;
            item.year = year;
            item.month = month;
            item.revenue = pay.amount;
            if (monthlyRevenue.length > 0) {
              // Check if exist year
              const isExistedYear = monthlyRevenue.find(
                (item) => item.year === year
              );
              if (isExistedYear) {
                // Check if exist month
                const years = monthlyRevenue.filter(
                  (item) => item.year === year
                );
                const isExistedMonth = years.find(
                  (item) => item.month === month
                );
                if (isExistedMonth) {
                  // Add new amount to existed month
                  const index = years.findIndex((item) => item.month === month);
                  monthlyRevenue[index].revenue += pay.amount;
                } else {
                  monthlyRevenue.push(item);
                }
              } else {
                monthlyRevenue.push(item);
              }
            } else {
              monthlyRevenue.push(item);
            }
          }
        }
      } else {
        break;
      }
    }
    if (monthlyRevenue.length > 0) {
      // console.log(monthlyRevenue);
      setMonthlyRevenue(monthlyRevenue);
    }
  }, []);

  // Update states for renenue statistics
  useEffect(() => {
    const des = 'This month: $' + totalRevenue;
    setStats((prev) => ({
      ...prev,
      totalRevenue: {
        ...prev.totalRevenue,
        value: totalRevenue,
        description: des,
      },
    }));
  }, [totalRevenue]);

  // Update states for ratings statistics
  useEffect(() => {
    setStats((prev) => ({
      ...prev,
      avgRating: {
        ...prev.avgRating,
        value: ratings,
      },
    }));
  }, [ratings]);

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

  const getPublishedCourses = (courses: Course[]) => {
    const publishedCourses = courses.filter((course: Course) => {
      const courseStatus = getCourseStatus(
        course.is_published,
        course.is_approved
      );
      return courseStatus === 'published' || courseStatus === 'discontinued';
    });

    setPublishedCourses(publishedCourses);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-card rounded-lg p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, John!
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
        {Object.entries(stats).map((stat) => (
          <Link href={stat[1].href}>
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
              courses.slice(0, 3).map((course) => (
                <Link
                  href={`/instructor/coursers/${course.id}`}
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
              notifications.slice(0, 3).map((notification) => (
                <div key={notification.id} className="flex space-x-3">
                  <div
                    className={`h-2 w-2 rounded-full mt-2 ${
                      notification.isRead ? 'bg-muted' : 'bg-primary'
                    }`}
                  />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{notification.title}</p>
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
                monthlyRevenue.map((item, index) => (
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
            {/* {students.slice(0, 4).map((student) => (
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
            ))} */}
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
