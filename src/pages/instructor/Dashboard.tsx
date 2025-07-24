import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

export const Dashboard = () => {
  const courses = useSelector((state: RootState) => state.courses.courses);
  const students = useSelector((state: RootState) => state.students.students);
  const earnings = useSelector((state: RootState) => state.earnings.stats);
  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications
  );

  const publishedCourses = courses.filter(
    (course) => course.status === 'published'
  );
  const totalStudents = publishedCourses.reduce(
    (sum, course) => sum + course.studentsCount,
    0
  );
  const recentNotifications = notifications.slice(0, 3);

  const stats = [
    {
      title: 'Total Courses',
      value: courses.length,
      description: `${publishedCourses.length} published`,
      icon: BookOpen,
      color: 'text-primary',
    },
    {
      title: 'Total Students',
      value: totalStudents,
      description: '+12% from last month',
      icon: Users,
      color: 'text-success',
    },
    {
      title: 'Total Revenue',
      value: `$${earnings.totalRevenue.toLocaleString()}`,
      description: 'This month: $4,120',
      icon: DollarSign,
      color: 'text-warning',
    },
    {
      title: 'Avg Rating',
      value: '4.7',
      description: 'Across all courses',
      icon: Star,
      color: 'text-instructor-accent',
    },
  ];

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
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Courses */}
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Courses</CardTitle>
            <CardDescription>Your latest course activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {courses.slice(0, 3).map((course) => (
              <div key={course.id} className="flex items-center space-x-4">
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div className="flex-1 space-y-1">
                  <h4 className="text-sm font-medium">{course.title}</h4>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Badge
                      variant={
                        course.status === 'published' ? 'default' : 'secondary'
                      }
                    >
                      {course.status}
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
              </div>
            ))}
            <Link href="/instructor/courses">
              <Button variant="outline" className="w-full mt-4">
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
            {recentNotifications.map((notification) => (
              <div key={notification.id} className="flex space-x-3">
                <div
                  className={`h-2 w-2 rounded-full mt-2 ${
                    notification.read ? 'bg-muted' : 'bg-primary'
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
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>
              Your earnings over the last 3 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {earnings.monthlyRevenue.map((revenue, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {new Date(revenue.date).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">
                      ${revenue.amount.toLocaleString()}
                    </span>
                    <TrendingUp className="h-4 w-4 text-success" />
                  </div>
                </div>
              ))}
            </div>
            <Link href="/instructor/earnings">
              <Button variant="outline" className="w-full mt-4">
                <DollarSign className="mr-2 h-4 w-4" />
                View Detailed Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>

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
              <Button variant="outline" className="w-full mt-4">
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

// "use client"

// import { BookOpen } from "lucide-react"
// import Link from "next/link"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Chart, ChartSeries, Tooltip, XAxis, YAxis } from "@/components/ui/chart"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Separator } from "@/components/ui/separator"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// const stats = [
//   {
//     title: "Total Students",
//     value: "2,457",
//     percentageChange: 5,
//     color: "text-blue-500",
//   },
//   {
//     title: "Total Courses",
//     value: "32",
//     percentageChange: 12,
//     color: "text-green-500",
//   },
//   {
//     title: "Avg Rating",
//     value: "4.8",
//     percentageChange: -3,
//     color: "text-accent",
//   },
//   {
//     title: "Total Revenue",
//     value: "$12,500",
//     percentageChange: 8,
//     color: "text-yellow-500",
//   },
// ]

// const data = [
//   {
//     date: "Jan 1",
//     revenue: 200,
//   },
//   {
//     date: "Jan 2",
//     revenue: 300,
//   },
//   {
//     date: "Jan 3",
//     revenue: 250,
//   },
//   {
//     date: "Jan 4",
//     revenue: 400,
//   },
//   {
//     date: "Jan 5",
//     revenue: 350,
//   },
//   {
//     date: "Jan 6",
//     revenue: 500,
//   },
//   {
//     date: "Jan 7",
//     revenue: 450,
//   },
//   {
//     date: "Jan 8",
//     revenue: 600,
//   },
//   {
//     date: "Jan 9",
//     revenue: 550,
//   },
//   {
//     date: "Jan 10",
//     revenue: 700,
//   },
// ]

// const recentCourses = [
//   {
//     title: "The Complete Web Development Bootcamp",
//     progress: 75,
//   },
//   {
//     title: "Mastering Data Structures & Algorithms",
//     progress: 50,
//   },
//   {
//     title: "Advanced React Patterns",
//     progress: 25,
//   },
// ]

// const recentNotifications = [
//   {
//     message: "New student enrolled in The Complete Web Development Bootcamp",
//     time: "5 minutes ago",
//   },
//   {
//     message: "You have a new message from a student",
//     time: "10 minutes ago",
//   },
//   {
//     message: "Your course Mastering Data Structures & Algorithms is trending",
//     time: "30 minutes ago",
//   },
// ]

// const recentStudents = [
//   {
//     name: "John Doe",
//     email: "john.doe@example.com",
//   },
//   {
//     name: "Jane Smith",
//     email: "jane.smith@example.com",
//   },
//   {
//     name: "Mike Johnson",
//     email: "mike.johnson@example.com",
//   },
// ]

// export function Dashboard() {
//   return (
//     <div className="container py-10">
//       {/* Welcome Section */}
//       <div className="bg-gradient-card rounded-lg p-6 shadow-card">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-foreground">Welcome back, John!</h1>
//             <p className="text-muted-foreground mt-1">Here's what's happening with your courses today.</p>
//           </div>
//           <div className="flex gap-3">
//             <Link href="/instructor/courses/create">
//               <Button className="bg-gradient-primary shadow-elegant">
//                 <BookOpen className="mr-2 h-4 w-4" />
//                 Create Course
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-4">
//         {stats.map((stat) => (
//           <Card key={stat.title} className="shadow-card">
//             <CardHeader>
//               <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stat.value}</div>
//               <div className="text-sm mt-1 flex items-center">
//                 <span className={`${stat.percentageChange > 0 ? "text-green-500" : "text-red-500"} mr-1`}>
//                   {stat.percentageChange > 0 ? "+" : ""}
//                   {stat.percentageChange}%
//                 </span>
//                 <span>vs. previous month</span>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Main Content Grid */}
//       <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-3">
//         {/* Recent Courses */}
//         <Card className="shadow-card lg:col-span-2">
//           <CardHeader>
//             <CardTitle>Recent Courses</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ScrollArea className="h-[300px] w-full">
//               <div className="space-y-4">
//                 {recentCourses.map((course) => (
//                   <div key={course.title} className="space-y-2">
//                     <div className="text-sm font-medium">{course.title}</div>
//                     <div className="relative h-2 bg-gray-200 rounded-full">
//                       <div
//                         className="absolute h-full bg-blue-500 rounded-full"
//                         style={{ width: `${course.progress}%` }}
//                       ></div>
//                     </div>
//                     <div className="text-xs text-muted-foreground">{course.progress}% Complete</div>
//                   </div>
//                 ))}
//               </div>
//             </ScrollArea>
//           </CardContent>
//         </Card>

//         {/* Recent Notifications */}
//         <Card className="shadow-card">
//           <CardHeader>
//             <CardTitle>Recent Notifications</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ScrollArea className="h-[300px] w-full">
//               <div className="space-y-4">
//                 {recentNotifications.map((notification) => (
//                   <div key={notification.message} className="space-y-2">
//                     <div className="text-sm">{notification.message}</div>
//                     <div className="text-xs text-muted-foreground">{notification.time}</div>
//                     <Separator />
//                   </div>
//                 ))}
//               </div>
//             </ScrollArea>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Revenue Chart and Recent Students */}
//       <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
//         {/* Revenue Chart */}
//         <Card className="shadow-card">
//           <CardHeader>
//             <CardTitle>Revenue Chart</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Chart className="h-[300px]">
//               <XAxis dataKey="date" />
//               <YAxis />
//               <ChartSeries data={data} type="line" dataKey="revenue" stroke="#8884d8" />
//               <Tooltip />
//             </Chart>
//           </CardContent>
//         </Card>

//         {/* Recent Students */}
//         <Card className="shadow-card">
//           <CardHeader>
//             <CardTitle>Recent Students</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Email</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {recentStudents.map((student) => (
//                   <TableRow key={student.email}>
//                     <TableCell>{student.name}</TableCell>
//                     <TableCell>{student.email}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

