"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import {
  getCourseById,
  getCourseReviews,
  Course,
  Review,
} from "@/app/data/courses";
import { CourseHeader } from "@/components/course-detail/CourseHeader";
import { CourseContent } from "@/components/course-detail/CourseContent";
import { InstructorProfile } from "@/components/course-detail/InstructorProfile";
import { ReviewsList } from "@/components/course-detail/ReviewsList";
import { CourseDetailSkeleton } from "@/components/course-detail/CourseDetailSkeleton";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params?.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const handleEnroll = async () => {
    try {
      // In real app, make API call to enroll user
      console.log("Enrolling in course:", courseId);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsEnrolled(true);

      // Show success message (you could use a toast library)
      alert("Successfully enrolled in course!");
    } catch (error) {
      console.error("Failed to enroll:", error);
      alert("Failed to enroll. Please try again.");
    }
  };

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const courseData = getCourseById(courseId);
        if (!courseData) {
          notFound();
          return;
        }

        const reviewsData = getCourseReviews(courseId);

        setCourse(courseData);
        setReviews(reviewsData);

        // Mock enrollment status - in real app, check user's enrollment
        setIsEnrolled(Math.random() > 0.7); // 30% chance of being enrolled
      } catch (err) {
        setError("Failed to load course data. Please try again.");
        console.error("Error loading course:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      loadCourseData();
    }
  }, [courseId]);

  if (isLoading) {
    return <CourseDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    notFound();
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <CourseHeader
              course={course}
              isEnrolled={isEnrolled}
              variant="full"
              onEnroll={handleEnroll}
            />

            {/* Course Content */}
            <CourseContent course={course} isEnrolled={isEnrolled} />

            {/* Reviews */}
            <ReviewsList
              reviews={reviews}
              courseRating={course.rating || 0}
              totalReviews={reviews.length}
              isEnrolled={isEnrolled}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Header (Compact) */}
            <CourseHeader
              course={course}
              isEnrolled={isEnrolled}
              variant="compact"
              className="lg:block hidden"
              onEnroll={handleEnroll}
            />

            {/* Instructor Profile */}
            {course.instructor && (
              <InstructorProfile instructor={course.instructor} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
