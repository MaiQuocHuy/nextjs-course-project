"use client";

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
  ShoppingCart,
  Loader2,
} from "lucide-react";
import { Course } from "@/services/coursesApi";
import { cn } from "@/lib/utils";

interface CourseHeaderProps {
  course: Course;
  isEnrolled: boolean;
  onEnroll: () => void;
  className?: string;
  variant?: "full" | "compact";
  isEnrolling?: boolean;
}

export function CourseHeader({
  course,
  isEnrolled,
  onEnroll,
  className = "",
  variant = "full",
  isEnrolling = false,
}: CourseHeaderProps) {
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

  const getDurationInHours = () => {
    // Estimate 1 hour per section on average
    return course.sectionCount || 5;
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "BEGINNER":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "INTERMEDIATE":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "ADVANCED":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  if (variant === "compact") {
    return (
      <Card className={cn("lg:block hidden sticky top-8", className)}>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Course Image */}
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
              <Image
                src={course.thumbnailUrl || "/placeholder-course.jpg"}
                alt={course.title}
                width={400}
                height={225}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder-course.jpg";
                }}
              />
            </div>

            {/* Price */}
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {formatPrice(course.price)}
              </div>
            </div>

            {/* Enroll Button */}
            {isEnrolled ? (
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                disabled
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Enrolled
              </Button>
            ) : (
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={onEnroll}
                disabled={isEnrolling}
                size="lg"
              >
                {isEnrolling ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enrolling...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Enroll Now
                  </>
                )}
              </Button>
            )}

            {/* Course Includes */}
            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="font-medium text-sm text-gray-900 dark:text-white">
                This course includes:
              </p>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>{getDurationInHours()} hours on-demand video</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>{course.sectionCount} sections</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>Access on mobile and desktop</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Certificate of completion</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full variant
  return (
    <Card className={cn("overflow-hidden shadow-sm", className)}>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Course Image */}
          <div className="relative aspect-video lg:aspect-auto lg:h-96 bg-gray-100 dark:bg-gray-700">
            <Image
              src={course.thumbnailUrl || "/placeholder-course.jpg"}
              alt={course.title}
              fill
              className="object-cover"
              priority
              onError={(e) => {
                e.currentTarget.src = "/placeholder-course.jpg";
              }}
            />

            {/* Play Button Overlay - Always show for preview */}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 transform scale-90 hover:scale-100 transition-transform duration-300 shadow-lg">
                <Play className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            {/* Level Badge */}
            <div className="absolute top-4 left-4">
              <Badge className={getLevelBadgeColor(course.level)}>
                {course.level}
              </Badge>
            </div>

            {/* Category Badge */}
            {course.category && (
              <div className="absolute top-4 right-4">
                <Badge
                  variant="secondary"
                  className="bg-white/95 backdrop-blur-sm text-gray-800 border-0 shadow-sm font-medium"
                >
                  {course.category.name}
                </Badge>
              </div>
            )}

            {/* Bestseller Badge */}
            {(course.averageRating || 0) >= 4.5 &&
              course.enrollCount >= 100 && (
                <div className="absolute top-14 right-4">
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
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
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
                  src={`https://ui-avatars.com/api/?name=${course.instructor.name}&background=3b82f6&color=fff`}
                  alt={course.instructor.name}
                />
                <AvatarFallback className="bg-blue-600 text-white">
                  {course.instructor.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {course.instructor.name}
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
                        i < Math.floor(course.averageRating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {(course.averageRating || 0).toFixed(1)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({Math.floor(course.enrollCount * 0.1)} reviews)
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>
                    {formatStudentsCount(course.enrollCount)} students
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.sectionCount} sections</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{getDurationInHours()}h total</span>
                </div>
              </div>
            </div>

            {/* Price & Action */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              {!isEnrolled && (
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {formatPrice(course.price)}
                </div>
              )}

              <Button
                onClick={onEnroll}
                disabled={isEnrolling || isEnrolled}
                size="lg"
                className={cn(
                  "h-12 px-8 text-lg font-semibold transition-all duration-300",
                  isEnrolled
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl",
                  !isEnrolled && "sm:w-auto w-full"
                )}
              >
                {isEnrolling ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </div>
                ) : isEnrolled ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Enrolled
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
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
