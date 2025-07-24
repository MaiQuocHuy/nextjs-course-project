"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  Users,
  BookOpen,
  Award,
  MapPin,
  Calendar,
  ExternalLink,
  Mail,
  MessageCircle,
} from "lucide-react";
import { User } from "@/app/data/courses";
import { cn } from "@/lib/utils";

interface InstructorProfileProps {
  instructor: User;
  className?: string;
}

export function InstructorProfile({
  instructor,
  className = "",
}: InstructorProfileProps) {
  // Mock instructor stats - in real app, these would come from API
  const mockStats = {
    totalCourses: 12,
    totalStudents: 15420,
    averageRating: 4.7,
    totalReviews: 2834,
    yearsTeaching: 8,
    specializations: ["Web Development", "Mobile Apps", "UI/UX Design"],
  };

  const mockBio =
    "John is a seasoned software engineer with over 8 years of experience in full-stack development. He has worked with major tech companies and startups, building scalable web applications and mentoring junior developers. His passion for teaching and clear communication style has helped thousands of students master modern web technologies.";

  const mockAchievements = [
    "Senior Software Engineer at Google",
    "Published author of 3 programming books",
    "Speaker at 25+ tech conferences",
    "Mentor to 500+ developers worldwide",
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Instructor Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            {/* Avatar and Basic Info */}
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={instructor.avatar}
                  alt={instructor.name}
                  className="object-cover"
                />
                <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                  {instructor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {instructor.name}
                </h2>

                <Badge variant="secondary" className="mt-1">
                  {instructor.role === "INSTRUCTOR"
                    ? "Course Instructor"
                    : instructor.role}
                </Badge>

                <div className="flex items-center gap-3 mt-2 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Since 2016</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>San Francisco</span>
                  </div>
                </div>
              </div>
            </div>{" "}
            {/* Stats Grid */}
            <div className="w-full">
              <div className="grid grid-cols-2 lg:grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      {mockStats.averageRating}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Instructor Rating
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {formatNumber(mockStats.totalReviews)} reviews
                  </p>
                </div>

                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      {formatNumber(mockStats.totalStudents)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Students
                  </p>
                </div>

                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <BookOpen className="w-4 h-4 text-green-600" />
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      {mockStats.totalCourses}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Courses
                  </p>
                </div>

                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      {mockStats.yearsTeaching}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Years Teaching
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-xs"
                >
                  <MessageCircle className="w-3 h-3" />
                  Message
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-xs"
                >
                  <ExternalLink className="w-3 h-3" />
                  Profile
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-xs"
                >
                  <Mail className="w-3 h-3" />
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bio Section */}
      <Card>
        <CardHeader>
          <CardTitle>About the Instructor</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {mockBio}
          </p>

          {/* Specializations */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              Specializations
            </h4>
            <div className="flex flex-wrap gap-2">
              {mockStats.specializations.map((spec, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                >
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            Achievements & Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAchievements.map((achievement, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">
                  {achievement}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Other Courses by Instructor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              More courses by {instructor.name}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              View All
              <ExternalLink className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mock other courses */}
            {[1, 2].map((courseNum) => (
              <div
                key={courseNum}
                className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <div className="w-16 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
                  IMG
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2">
                    Advanced React Patterns & Performance Optimization
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        4.8
                      </span>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      ({formatNumber(1200 + courseNum * 300)} students)
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">
                    $79.99
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
