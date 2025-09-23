"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  PlayCircle,
  FileText,
  MessageSquare,
  Lightbulb,
  Clock,
  Users,
  BookOpen,
  CheckCircle,
  Star,
  Award,
  Target,
  Lock,
} from "lucide-react";
import { Course, Section } from "@/services/coursesApi";
import { useGetCourseReviewsBySlugQuery } from "@/services/coursesApi";
import { cn } from "@/lib/utils";

interface CourseContentProps {
  course: Course;
  sections?: Section[];
  isEnrolled: boolean;
  className?: string;
}

export function CourseContent({
  course,
  sections = [],
  isEnrolled,
  className = "",
}: CourseContentProps) {

  // Fetch reviews data
  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useGetCourseReviewsBySlugQuery(course.slug);

  // Calculate average rating from reviews
  const calculateAverageRating = () => {
    if (!reviewsData || reviewsData.content.length === 0) return 0;

    const totalRating = reviewsData.content.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    return totalRating / reviewsData.content.length;
  };

  const averageRating = calculateAverageRating();

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "5 min";

    if (seconds < 60) return `${seconds} sec`; // Dưới 1 phút thì hiển thị giây

    if (seconds < 3600) {
      // Dưới 1 giờ thì hiển thị phút
      const minutes = Math.floor(seconds / 60);
      return `${minutes} min`;
    }

    const hours = Math.floor(seconds / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);

    if (remainingMinutes === 0) return `${hours}h`;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return <PlayCircle className="w-4 h-4 text-blue-600" />;
      case "TEXT":
        return <FileText className="w-4 h-4 text-green-600" />;
      case "DISCUSSION":
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case "PROJECT":
        return <Lightbulb className="w-4 h-4 text-orange-600" />;
      case "QUIZ":
        return <Award className="w-4 h-4 text-red-600" />;
      default:
        return <PlayCircle className="w-4 h-4 text-blue-600" />;
    }
  };

  const getTotalDuration = () => {
    // Nếu API đã trả về totalDuration thì dùng luôn
    if (course?.totalDuration && course.totalDuration > 0) {
      return course.totalDuration;
    }

    // Nếu không có dữ liệu sections thì ước lượng
    if (!sections || sections.length === 0) {
      return (course?.sectionCount || 0) * 45 * 60; // 45 phút/section
    }

    // Tính tổng từ sections & lessons
    return sections.reduce((totalSeconds, section) => {
      return (
        totalSeconds +
        section.lessons.reduce((sectionSeconds, lesson) => {
          return sectionSeconds + (lesson.duration || 0); // duration từ API là giây
        }, 0)
      );
    }, 0);
  };

  const getTotalLessons = () => {
    if (sections.length === 0) {
      return course.sectionCount * 5; // Estimate 5 lessons per section
    }
    return sections.reduce(
      (total, section) => total + section.lessons.length,
      0
    );
  };

  const getPreviewLessonsCount = () => {
    if (course.sampleVideoUrl) {
      return 1;
    }
  };

  // const getPreviewLessons = () => {
  //   if (course.sampleVideoUrl) {
  //     return [
  //       {
  //         title: "Sample Preview",
  //         url: course.sampleVideoUrl,
  //       },
  //     ];
  //   }
  // };

  // Mock data if no sections provided
  
  const displaySections =
    sections.length > 0
      ? sections
      : [
          {
            id: "1",
            title: "Getting Started",
            lessons: [
              {
                id: "1",
                title: "Course Introduction",
                type: "VIDEO" as const,
                duration: 10,
                isPreview: true,
              },
              {
                id: "2",
                title: "Setting Up Your Environment",
                type: "VIDEO" as const,
                duration: 15,
              },
              {
                id: "3",
                title: "Course Resources",
                type: "TEXT" as const,
                duration: 5,
                isPreview: true,
              },
            ],
          },
          {
            id: "2",
            title: "Core Concepts",
            lessons: [
              {
                id: "4",
                title: "Understanding the Basics",
                type: "VIDEO" as const,
                duration: 20,
              },
              {
                id: "5",
                title: "Practical Examples",
                type: "VIDEO" as const,
                duration: 25,
              },
              {
                id: "6",
                title: "Quiz: Test Your Knowledge",
                type: "QUIZ" as const,
                duration: 10,
              },
            ],
          },
          {
            id: "3",
            title: "Advanced Topics",
            lessons: [
              {
                id: "7",
                title: "Advanced Techniques",
                type: "VIDEO" as const,
                duration: 30,
              },
              {
                id: "8",
                title: "Real-world Project",
                type: "PROJECT" as const,
                duration: 45,
              },
              {
                id: "9",
                title: "Discussion Forum",
                type: "DISCUSSION" as const,
                duration: 0,
              },
            ],
          },
        ];

  const courseHighlights = [
    { icon: Target, text: "Learn industry best practices" },
    { icon: Award, text: "Get certificate of completion" },
    { icon: Users, text: "Join community of learners" },
    { icon: BookOpen, text: "Access to course materials" },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      <Tabs defaultValue="curriculum" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="curriculum" className="space-y-6">
          {/* Course Stats */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-600">
                    {displaySections.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Sections
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-600">
                    {getTotalLessons()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Lessons
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-600">
                    {(() => {
                      const totalSeconds = getTotalDuration();
                      const hours = Math.floor(totalSeconds / 3600);
                      const minutes = Math.floor((totalSeconds % 3600) / 60);
                      const secs = totalSeconds % 60;

                      if (hours > 0) {
                        return minutes > 0
                          ? `${hours}h ${minutes}m`
                          : `${hours}h`;
                      }
                      return minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;
                    })()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Duration
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-orange-600">
                    {getPreviewLessonsCount()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Free Preview
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview Video Section */}
          {course.sampleVideoUrl && (
            <Card data-course-preview>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Course Preview</span>
                  <Badge
                    variant="outline"
                    className="text-blue-600 border-blue-600"
                  >
                    FREE
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm font-semibold">
                        0
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <PlayCircle className="w-5 h-5 text-blue-600" />
                          Course Preview
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Watch a preview of what you'll learn in this course
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        onClick={() => {
                          // Here you could implement video modal or player
                          window.open(course.sampleVideoUrl, "_blank");
                        }}
                      >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Watch Preview
                      </Button>
                    </div>

                    {/* Video Preview */}
                    <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                      <video
                        className="w-full h-full object-cover"
                        controls
                        poster={course.thumbnailUrl}
                      >
                        <source src={course.sampleVideoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Course Sections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Course Content</span>
                <Badge variant="secondary">
                  {displaySections.length} sections • {getTotalLessons()}{" "}
                  lessons
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Accordion type="multiple" className="w-full">
                {displaySections.map((section, index) => (
                  <AccordionItem
                    key={section.id}
                    value={section.id}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center justify-between w-full mr-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm font-semibold">
                            {index + 1}
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {section.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {section.lessons.length} lessons •{" "}
                              {formatDuration(
                                section.lessons.reduce(
                                  (total, lesson) =>
                                    total + (lesson.duration || 10),
                                  0
                                )
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="space-y-2">
                        {section.lessons.map((lesson, lessonIndex) => {
                          const canAccess = isEnrolled || lesson.isPreview;

                          return (
                            <div
                              key={lesson.id}
                              className={cn(
                                "flex items-center justify-between p-3 rounded-lg transition-colors",
                                canAccess
                                  ? "hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                                  : "bg-gray-50 dark:bg-gray-800"
                              )}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs">
                                  {lessonIndex + 1}
                                </div>
                                {getLessonIcon(lesson.type)}
                                <div className="flex-1">
                                  <div
                                    className={cn(
                                      "font-medium",
                                      canAccess
                                        ? "text-gray-900 dark:text-white"
                                        : "text-gray-500 dark:text-gray-400"
                                    )}
                                  >
                                    {lesson.title}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <Clock className="w-3 h-3" />
                                    {formatDuration(lesson.duration)}
                                    {lesson.isPreview && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs py-0 px-2"
                                      >
                                        Preview
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {!canAccess && (
                                  <Lock className="w-4 h-4 text-gray-400" />
                                )}
                                {canAccess && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                  >
                                    {lesson.type === "VIDEO" ? "Watch" : "View"}
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          {/* What You'll Learn */}
          <Card>
            <CardHeader>
              <CardTitle>What You'll Learn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {courseHighlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {highlight.text}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Course Description */}
          <Card>
            <CardHeader>
              <CardTitle>Course Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {course.description}
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                  This comprehensive course is designed to take you from
                  beginner to advanced level. You'll learn through practical
                  examples, real-world projects, and interactive exercises that
                  reinforce your understanding of key concepts.
                </p>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                  Who this course is for:
                </h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Beginners looking to start their learning journey</li>
                  <li>Intermediate learners wanting to advance their skills</li>
                  <li>Professionals seeking to update their knowledge</li>
                  <li>Anyone interested in mastering this subject</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  Basic computer skills and internet access
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  Willingness to learn and practice
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  No prior experience required - we'll start from the basics
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          {/* Rating Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Student Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {reviewsLoading ? (
                <div className="text-center py-8">
                  <div className="text-gray-500">Loading reviews...</div>
                </div>
              ) : reviewsError ? (
                <div className="text-center py-8">
                  <div className="text-red-500">Failed to load reviews</div>
                </div>
              ) : reviewsData && reviewsData.content.length > 0 ? (
                <>
                  <div className="flex items-center gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 dark:text-white">
                        {averageRating.toFixed(1)}
                      </div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(averageRating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Course Rating ({reviewsData.content.length} review
                        {reviewsData.content.length !== 1 ? "s" : ""})
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="space-y-2">
                        {(() => {
                          // Calculate rating distribution from actual reviews
                          const ratingCounts = [1, 2, 3, 4, 5].reduce(
                            (acc, rating) => {
                              acc[rating] = reviewsData.content.filter(
                                (review) => review.rating === rating
                              ).length;
                              return acc;
                            },
                            {} as Record<number, number>
                          );

                          const totalReviews = reviewsData.content.length;

                          return [5, 4, 3, 2, 1].map((rating) => {
                            const count = ratingCounts[rating] || 0;
                            const percentage =
                              totalReviews > 0
                                ? Math.round((count / totalReviews) * 100)
                                : 0;

                            return (
                              <div
                                key={rating}
                                className="flex items-center gap-3"
                              >
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm text-gray-600 dark:text-gray-400 w-2">
                                    {rating}
                                  </span>
                                </div>
                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div
                                    className="bg-yellow-400 h-2 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400 w-15">
                                  {percentage}% ({count})
                                </span>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Real Reviews from API */}
                  <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                    {reviewsData.content.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-100 dark:border-gray-800 pb-4 last:border-b-0"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white font-semibold">
                            {review.user.avatar ? (
                              <img
                                src={review.user.avatar}
                                alt={review.user.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              review.user.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="font-semibold text-gray-900 dark:text-white">
                                  {review.user.name}
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < review.rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300 dark:text-gray-600"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(
                                      review.reviewedAt
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                              {review.reviewText}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Pagination info if needed */}
                    {reviewsData.page &&
                      reviewsData.page.totalElements >
                        reviewsData.content.length && (
                        <div className="text-center pt-4">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Showing {reviewsData.content.length} of{" "}
                            {reviewsData.page.totalElements} reviews
                          </div>
                        </div>
                      )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="flex items-center gap-6 mb-6 justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 dark:text-white">
                        0.0
                      </div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 text-gray-300 dark:text-gray-600"
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        No ratings yet
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    No reviews yet. Be the first to review this course!
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
