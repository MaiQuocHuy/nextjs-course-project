"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewsList } from "./ReviewsList";

export interface Review {
  id: string;
  courseTitle: string;
  content: string;
  rating: number; // from 1 to 5
  status: "published" | "pending" | "rejected";
  submittedAt: string; // ISO string
}

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: "review-001",
    courseTitle: "React for Beginners",
    content:
      "This course was absolutely fantastic! The instructor explained everything clearly and the hands-on projects really helped solidify my understanding. I went from knowing nothing about React to building my first web application. Highly recommended for anyone starting their React journey!",
    rating: 5,
    status: "published",
    submittedAt: "2024-07-20T10:30:00Z",
  },
  {
    id: "review-002",
    courseTitle: "Advanced TypeScript",
    content:
      "Great course with deep dive into TypeScript concepts. The advanced topics like conditional types and mapped types were well explained. However, I felt the pace was a bit fast in some sections. Overall, a solid course for intermediate developers.",
    rating: 4,
    status: "published",
    submittedAt: "2024-07-18T14:15:00Z",
  },
  {
    id: "review-003",
    courseTitle: "Next.js Full Stack",
    content:
      "Amazing comprehensive course covering both frontend and backend development with Next.js. The API routes section was particularly helpful. The instructor's teaching style is engaging and easy to follow.",
    rating: 5,
    status: "pending",
    submittedAt: "2024-07-22T09:45:00Z",
  },
  {
    id: "review-004",
    courseTitle: "Python Web Development",
    content:
      "The course content was good but I found some sections outdated. The Django part needs to be updated to reflect current best practices. Also, more practical examples would be helpful.",
    rating: 3,
    status: "rejected",
    submittedAt: "2024-07-21T16:20:00Z",
  },
  {
    id: "review-005",
    courseTitle: "Docker & Kubernetes",
    content:
      "Excellent practical course! Loved the hands-on approach with real-world scenarios. The explanations of container orchestration concepts were crystal clear. This course gave me the confidence to implement containerization in production.",
    rating: 5,
    status: "published",
    submittedAt: "2024-07-19T11:00:00Z",
  },
  {
    id: "review-006",
    courseTitle: "GraphQL with Node.js",
    content:
      "Good introduction to GraphQL but could use more advanced topics. The basics were covered well but I was expecting more depth in schema design and performance optimization.",
    rating: 3,
    status: "pending",
    submittedAt: "2024-07-17T13:30:00Z",
  },
  {
    id: "review-007",
    courseTitle: "Vue.js Fundamentals",
    content:
      "Well-structured course with clear explanations. The progression from basic concepts to building a complete application was smooth. The instructor's examples were relevant and easy to understand.",
    rating: 4,
    status: "published",
    submittedAt: "2024-07-16T08:45:00Z",
  },
  {
    id: "review-008",
    courseTitle: "AWS Cloud Practitioner",
    content:
      "Comprehensive coverage of AWS services with great preparation for the certification exam. The practice questions were very helpful. Definitely worth the investment!",
    rating: 5,
    status: "published",
    submittedAt: "2024-07-15T15:10:00Z",
  },
];

export function ReviewsPage() {
  const publishedCount = mockReviews.filter(
    (review) => review.status === "published"
  ).length;
  const pendingCount = mockReviews.filter(
    (review) => review.status === "pending"
  ).length;
  const rejectedCount = mockReviews.filter(
    (review) => review.status === "rejected"
  ).length;
  const averageRating =
    mockReviews.length > 0
      ? (
          mockReviews.reduce((sum, review) => sum + review.rating, 0) /
          mockReviews.length
        ).toFixed(1)
      : "0";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">My Reviews</h1>
        <p className="text-muted-foreground">
          Manage your course reviews and feedback
        </p>
      </div>

      {/* Review Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockReviews.length}</div>
            <p className="text-xs text-muted-foreground">Reviews submitted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {publishedCount}
            </div>
            <p className="text-xs text-muted-foreground">Live reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingCount}
            </div>
            <p className="text-xs text-muted-foreground">Under review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating}</div>
            <p className="text-xs text-muted-foreground">Out of 5 stars</p>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Course Reviews</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ReviewsList reviews={mockReviews} />
        </CardContent>
      </Card>
    </div>
  );
}
