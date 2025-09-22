"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  Users,
  PlayCircle,
  Award,
  BookOpen,
  MessageSquare,
  ExternalLink,
  Globe,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { Course } from "@/services/coursesApi";
import { cn } from "@/lib/utils";

interface InstructorProfileProps {
  course: Course;
  className?: string;
  variant?: "full" | "compact";
}

export function InstructorProfile({
  course,
  className = "",
  variant = "full",
}: InstructorProfileProps) {
  const instructor = course.instructor;
  const instructorOverviewInstructorSummary = course.overViewInstructorSummary;

  // Mock instructor stats (in real app, this would come from API)
  const instructorStats = {
    totalStudents: Math.floor(Math.random() * 50000) + 10000,
    totalCourses: Math.floor(Math.random() * 20) + 5,
    averageRating: (Math.random() * 1 + 4).toFixed(1),
    totalReviews: Math.floor(Math.random() * 5000) + 1000,
    yearsExperience: Math.floor(Math.random() * 10) + 5,
    expertise: ["Web Development", "JavaScript", "React", "Node.js"],
    location: "San Francisco, CA",
    joinedDate: "2019",
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  if (variant === "compact") {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Instructor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-blue-100 dark:ring-blue-900">
              <AvatarImage
                src={
                  instructor.thumbnailUrl ||
                  `https://ui-avatars.com/api/?name=${instructor.name}&background=3b82f6&color=fff`
                }
                alt={instructor.name}
              />
              <AvatarFallback className="bg-blue-600 text-white text-lg">
                {instructor.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                {instructor.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Expert Instructor
              </p>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {instructorStats.averageRating}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  • {formatNumber(instructorStats.totalStudents)} students
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <div className="text-lg font-bold text-blue-600">
                {instructorStats.totalCourses}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Courses
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                {formatNumber(instructorStats.totalReviews)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Reviews
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              // Navigate to instructor profile
              console.log("View instructor profile");
            }}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Profile
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Full variant
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Your Instructor
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Instructor Header */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0">
              <Avatar className="h-24 w-24 ring-4 ring-blue-100 dark:ring-blue-900 shadow-lg">
                <AvatarImage
                  src={
                    instructor.thumbnailUrl ||
                    `https://ui-avatars.com/api/?name=${instructor.name}&background=3b82f6&color=fff&size=96`
                  }
                  alt={instructor.name}
                />
                <AvatarFallback className="bg-blue-600 text-white text-2xl">
                  {instructor.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {instructor.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Senior Software Engineer & Educator
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{instructorStats.location}</span>
                  <span>•</span>
                  <Calendar className="w-4 h-4" />
                  <span>Joined {instructorStats.joinedDate}</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {formatNumber(instructorStats.totalStudents)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Students
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    {
                      instructorOverviewInstructorSummary.totalCoursesByInstructor
                    }
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Courses
                  </div>
                </div>
                <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                  <div className="text-lg font-bold text-yellow-600">
                    {Number(
                      instructorOverviewInstructorSummary.average?.toFixed(1)
                    )}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Rating
                  </div>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">
                    {instructorStats.yearsExperience}+
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Years
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              About {instructor.name.split(" ")[0]}
            </h4>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {instructor.bio}
            </p>
          </div>

          {/* Expertise */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Areas of Expertise
            </h4>
            <div className="flex flex-wrap gap-2">
              {instructorStats.expertise.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Achievements
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Top-Rated Instructor
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Consistently rated {instructorStats.averageRating}+ stars by
                    students
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    High Impact Educator
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Taught {formatNumber(instructorStats.totalStudents)}+
                    students worldwide
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Course Creator
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Published {instructorStats.totalCourses} comprehensive
                    courses
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Connect Section */}
          <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Connect with {instructor.name.split(" ")[0]}
            </h4>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(
                    "https://www.linkedin.com/in/sundarpichai",
                    "_blank"
                  )
                }
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Full Profile
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Follow:
              </span>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-600 hover:text-blue-600"
                  onClick={() => (
                    window.open("https://www.linkedin.com"), "_blank"
                  )}
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-600 hover:text-blue-400"
                  onClick={() => (
                    window.open("https://www.twitter.com"), "_blank"
                  )}
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-600 hover:text-green-600"
                  onClick={() => (
                    window.open("https://www.facebook.com"), "_blank"
                  )}
                >
                  <Globe className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Reviews Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-semibold text-gray-900 dark:text-white">
                Student Reviews
              </h5>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  {Number(
                    instructorOverviewInstructorSummary.average?.toFixed(1)
                  )}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({formatNumber(instructorStats.totalReviews)} reviews)
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              "Excellent instructor with clear explanations and practical
              examples. Highly recommend their courses!"
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
