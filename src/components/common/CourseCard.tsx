"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Clock, PlayCircle, BookOpen, Award } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Course } from "@/services/coursesApi";

interface CourseCardProps {
  course: Course;
  className?: string;
  variant?: "grid" | "list";
}

export function CourseCard({
  course,
  className = "",
  variant = "grid",
}: CourseCardProps) {
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
    // Sử dụng sectionCount từ API thay vì tính toán từ sections
    return course.sectionCount || 0;
  };

  const getDurationInHours = () => {
    // Estimate 10 minutes per lesson
    const totalMinutes = getTotalLessons() * 10;
    return Math.round(totalMinutes / 60);
  };

  const isListView = variant === "list";

  if (isListView) {
    // List variant - horizontal layout
    return (
      <Card
        className={`group relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 transform ${className}`}
      >
        <div className="flex items-stretch">
          {/* Image Section - Centered vertically */}
          <div className="relative w-64 flex-shrink-0">
            <Image
              src={course.thumbnailUrl || "/placeholder-course.jpg"}
              alt={course.title}
              width={256}
              height={144}
              className="w-full h-full object-cover rounded-l-lg"
            />

            {/* Top Badges */}
            <div className="absolute top-2 left-2">
              <Badge
                variant="secondary"
                className="bg-white/95 backdrop-blur-sm text-gray-800 border-0 shadow-sm font-medium text-xs px-2 py-1"
              >
                {course.category?.name || "Course"}
              </Badge>
            </div>

            <div className="absolute top-2 right-2">
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg font-semibold text-xs px-2 py-1">
                {formatPrice(course.price)}
              </Badge>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 px-4 py-3">
            <div className="flex flex-col justify-between h-full min-h-[160px]">
              <div>
                {/* Title - Reduced margin */}
                <Link href={`/courses/${course.slug}`}>
                  <h3 className="text-lg font-bold line-clamp-2 hover:text-blue-600 transition-colors duration-300 mb-2 cursor-pointer">
                    {course.title}
                  </h3>
                </Link>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                  {course.description}
                </p>

                {/* Instructor */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <Image
                      src={
                        course.instructor?.avatar || "/placeholder-avatar.jpg"
                      }
                      alt={course.instructor?.name || "Instructor"}
                      width={32}
                      height={32}
                      className="rounded-full ring-2 ring-blue-100 dark:ring-blue-900"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {course.instructor?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Expert Instructor
                    </p>
                  </div>
                </div>

                {/* Rating & Stats - Compact layout */}
                <div className="flex items-center gap-6 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 transition-colors ${
                            i < Math.floor(course.averageRating || 0)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    {course.averageRating && course.averageRating > 0 ? (
                      <>
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {course.averageRating.toFixed(1)}
                        </span>
                        {course.enrollCount && course.enrollCount > 0 && (
                          <span className="text-xs text-gray-500">
                            ({formatStudentsCount(course.enrollCount)})
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        No ratings yet
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      <span>{getTotalLessons()} lessons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{getDurationInHours()}h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>
                        {course.enrollCount && course.enrollCount > 0
                          ? formatStudentsCount(course.enrollCount)
                          : "New"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Button - Reduced margin */}
              <div className="flex justify-end">
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 font-semibold px-6 py-2 rounded-lg group"
                >
                  <Link href={`/courses/${course.slug}`}>
                    <span className="group-hover:translate-x-0.5 transition-transform duration-300">
                      Enroll Now
                    </span>
                    <PlayCircle className="w-4 h-4 ml-2 group-hover:scale-105 transition-transform duration-300" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid variant - vertical layout
  return (
    <Card
      className={`group relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2 transform ${className}`}
    >
      {/* Premium Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Image Section with Overlay */}
      <div className="relative overflow-hidden">
        <Image
          src={course.thumbnailUrl}
          alt={course.title}
          width={400}
          height={225}
          className="w-full h-48 object-cover transition-all duration-300 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-lg">
            <PlayCircle className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3">
          <Badge
            variant="secondary"
            className="bg-white/95 backdrop-blur-sm text-gray-800 hover:bg-white border-0 shadow-sm font-medium text-xs px-2 py-1"
          >
            {course.category?.name || "Course"}
          </Badge>
        </div>

        <div className="absolute top-3 right-3">
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 border-0 shadow-lg font-semibold text-xs px-2 py-1">
            {formatPrice(course.price)}
          </Badge>
        </div>

        {/* Best Seller Badge */}
        {course.averageRating > 0 && course.averageRating >= 4.5 && (
          <div className="absolute top-10 right-3">
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-md text-xs px-2 py-1">
              <Award className="w-3 h-3 mr-1" />
              Bestseller
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="px-5 relative z-10">
        <div className="space-y-3">
          {/* Title - Fixed height for consistency */}
          <div className="h-12 flex items-start">
            <Link href={`/courses/${course.slug}`}>
              <h3 className="text-lg font-bold line-clamp-2 hover:text-blue-600 transition-colors duration-300 leading-tight cursor-pointer">
                {course.title}
              </h3>
            </Link>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
            {course.description}
          </p>

          {/* Instructor */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image
                src={
                  course.instructor?.avatar ||
                  "public/images/avatar-instructor.png"
                }
                alt={course.instructor?.name || "Instructor"}
                width={32}
                height={32}
                className="rounded-full ring-2 ring-blue-100 dark:ring-blue-900"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {course.instructor?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Expert Instructor
              </p>
            </div>
          </div>

          {/* Rating & Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 transition-colors ${
                      i < Math.floor(course.averageRating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              {/* Only show rating if it exists and > 0 */}
              {course.averageRating && course.averageRating > 0 ? (
                <>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {course.averageRating.toFixed(1)}
                  </span>
                  {course.enrollCount && course.enrollCount > 0 && (
                    <span className="text-xs text-gray-500">
                      ({formatStudentsCount(course.enrollCount)})
                    </span>
                  )}
                </>
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  No ratings yet
                </span>
              )}
            </div>
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                <BookOpen className="w-4 h-4" />
              </div>
              <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                {getTotalLessons()} Lessons
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                <Clock className="w-4 h-4" />
              </div>
              <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                {getDurationInHours()}h Total
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                <Users className="w-4 h-4" />
              </div>
              <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                {course.enrollCount && course.enrollCount > 0
                  ? formatStudentsCount(course.enrollCount)
                  : "New"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 relative z-10">
        <Button
          asChild
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 font-semibold py-3 rounded-lg group"
        >
          <Link href={`/courses/${course.slug}`}>
            <span className="group-hover:translate-x-0.5 transition-transform duration-300">
              Enroll Now
            </span>
            <PlayCircle className="w-4 h-4 ml-2 group-hover:scale-105 transition-transform duration-300" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
