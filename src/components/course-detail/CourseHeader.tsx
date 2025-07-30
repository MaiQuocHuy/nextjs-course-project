"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  Users,
  Clock,
  BookOpen,
  Award,
  Play,
  CheckCircle,
  Globe,
  Calendar,
} from "lucide-react";
import { Course } from "@/app/data/courses";
import { cn } from "@/lib/utils";

interface CourseHeaderProps {
  course: Course;
  isEnrolled: boolean;
  onEnroll: () => void;
  className?: string;
  variant?: "full" | "compact";
}

export function CourseHeader({
  course,
  isEnrolled,
  onEnroll,
  className = "",
  variant = "full",
}: CourseHeaderProps) {
  const [isEnrolling, setIsEnrolling] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatStudentsCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const getTotalLessons = () => {
    return (
      course.sections?.reduce(
        (total, section) => total + (section.lessons?.length || 0),
        0
      ) || 0
    );
  };

  const getDurationInHours = () => {
    // Estimate 10 minutes per lesson
    const totalMinutes = getTotalLessons() * 10;
    return Math.round(totalMinutes / 60);
  };

  const handleEnroll = async () => {
    setIsEnrolling(true);
    try {
      await onEnroll();
    } finally {
      setIsEnrolling(false);
    }
  };

  if (variant === "compact") {
    return (
      <Card className={cn("lg:hidden", className)}>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Price or Progress */}
            {!isEnrolled ? (
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(course.price)}
                </div>
                {course.rating && course.rating >= 4.5 && (
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                    <Award className="w-3 h-3 mr-1" />
                    Bestseller
                  </Badge>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Course Progress
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    30% Complete
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: "30%" }}
                  ></div>
                </div>
              </div>
            )}

            {/* Enroll Button */}
            <Button
              onClick={
                isEnrolled
                  ? () => {
                      // Navigate to course learning page
                      console.log("Continue learning course:", course.id);
                    }
                  : handleEnroll
              }
              disabled={isEnrolling}
              className={cn(
                "w-full h-12 text-lg font-semibold transition-all duration-300",
                isEnrolled
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
              )}
            >
              {isEnrolling ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : isEnrolled ? (
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Continue Learning
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Enroll Now
                </div>
              )}
            </Button>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{getTotalLessons()} lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{getDurationInHours()}h total</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>
                  {formatStudentsCount(course.studentsCount || 0)} students
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>English</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Course Image */}
          <div className="relative aspect-video lg:aspect-auto lg:h-96">
            <Image
              src={course.thumbnail || "/placeholder-course.jpg"}
              alt={course.title}
              fill
              className="object-cover"
              priority
            />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 transform scale-90 hover:scale-100 transition-transform duration-300 shadow-lg">
                <Play className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <Badge
                variant="secondary"
                className="bg-white/95 backdrop-blur-sm text-gray-800 border-0 shadow-sm font-medium"
              >
                {course.categories?.[0]?.name || "Course"}
              </Badge>
            </div>

            {/* Bestseller Badge */}
            {course.rating && course.rating >= 4.5 && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-md">
                  <Award className="w-3 h-3 mr-1" />
                  Bestseller
                </Badge>
              </div>
            )}
          </div>

          {/* Course Info */}
          <div className="p-6 lg:p-8 space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight mb-2">
                {course.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* Instructor */}
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 ring-2 ring-blue-100 dark:ring-blue-900">
                <AvatarImage
                  src={course.instructor?.avatar || "/placeholder-avatar.jpg"}
                  alt={course.instructor?.name}
                />
                <AvatarFallback>
                  {course.instructor?.name?.charAt(0) || "I"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {course.instructor?.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Expert Instructor
                </p>
              </div>
            </div>

            {/* Rating & Stats */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 transition-colors ${
                        i < Math.floor(course.rating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {course.rating?.toFixed(1)}
                </span>
                <span className="text-sm text-gray-500">
                  ({formatStudentsCount(course.studentsCount || 0)} students)
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{getTotalLessons()} lessons</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{getDurationInHours()}h</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Updated {new Date(course.updated_at).getFullYear()}
                  </span>
                </div>
              </div>
            </div>

            {/* Price & Action */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {!isEnrolled && (
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(course.price)}
                </div>
              )}

              <Button
                onClick={
                  isEnrolled
                    ? () => {
                        // Navigate to course learning page
                        console.log("Continue learning course:", course.id);
                      }
                    : handleEnroll
                }
                disabled={isEnrolling}
                size="lg"
                className={cn(
                  "h-12 px-8 text-lg font-semibold transition-all duration-300",
                  isEnrolled
                    ? "bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                )}
              >
                {isEnrolling ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : isEnrolled ? (
                  <div className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Continue Learning
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Enroll Now
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
