"use client";

import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetPaymentStatusQuery } from "@/services/paymentApi";
import { useGetCourseByIdQuery } from "@/services/coursesApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  BookOpen,
  ArrowRight,
  Download,
  Star,
  Users,
  PlayCircle,
  Mail,
  CreditCard,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface PaymentSuccessPageProps {
  params: Promise<{ id: string }>;
}

export default function PaymentSuccessPage({
  params,
}: PaymentSuccessPageProps) {
  const { id: courseId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id");

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch payment status
  const {
    data: paymentData,
    isLoading: isPaymentLoading,
    error: paymentError,
    refetch: refetchPayment,
  } = useGetPaymentStatusQuery(sessionId || "", {
    skip: !sessionId,
    refetchOnMountOrArgChange: true,
  });

  // Fetch course details
  const {
    data: course,
    isLoading: isCourseLoading,
    error: courseError,
  } = useGetCourseByIdQuery(courseId, {
    refetchOnMountOrArgChange: true,
  });

  // const course = courseResponse?.data;

  // Handle missing session ID
  useEffect(() => {
    if (mounted && !sessionId) {
      toast.error("Invalid payment session");
      router.push(`/courses/${courseId}`);
    }
  }, [mounted, sessionId, courseId, router]);

  // Handle payment errors
  useEffect(() => {
    if (paymentError) {
      console.error("Payment status error:", paymentError);
      toast.error("Failed to verify payment status");
    }
  }, [paymentError]);

  // Retry payment status check
  const handleRetryPaymentCheck = () => {
    refetchPayment();
    toast.info("Checking payment status...");
  };

  // Loading state
  if (!mounted || isPaymentLoading || isCourseLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 flex items-center justify-center">
        <Card className="w-full max-w-2xl mx-4">
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">
                  Verifying your payment...
                </h3>
                <p className="text-muted-foreground">
                  Please wait while we confirm your enrollment
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Payment failed or cancelled
  if (
    !paymentData ||
    paymentData.status === "FAILED" ||
    paymentData.status === "CANCELLED"
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 flex items-center justify-center">
        <Card className="w-full max-w-2xl mx-4">
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 text-red-600 dark:text-red-400">✕</div>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
                  Payment Failed
                </h1>
                <p className="text-muted-foreground">
                  {paymentData?.status === "CANCELLED"
                    ? "Payment was cancelled"
                    : "There was an issue processing your payment"}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  onClick={handleRetryPaymentCheck}
                  variant="outline"
                  className="flex-1"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Check Again
                </Button>
                <Button
                  onClick={() => router.push(`/courses/${courseId}`)}
                  className="flex-1"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Payment pending
  if (paymentData.status === "PENDING") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 flex items-center justify-center">
        <Card className="w-full max-w-2xl mx-4">
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  Payment Processing
                </h1>
                <p className="text-muted-foreground">
                  Your payment is being processed. This may take a few moments.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  onClick={handleRetryPaymentCheck}
                  variant="outline"
                  className="flex-1"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Check Status
                </Button>
                <Button
                  onClick={() => router.push("/dashboard/courses")}
                  className="flex-1"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  My Courses
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format date function
  const formatPaymentDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Payment successful
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-950/20 dark:via-blue-950/20 dark:to-purple-950/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Fade-in animation wrapper */}
        <div className="animate-in fade-in duration-1000">
          {/* Success Icon & Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              🎉 Thank you! Your payment was successful.
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              You have successfully enrolled in the course &quot;
              {course?.title || "Loading..."}&quot;
            </p>
          </div>

          {/* Transaction Confirmation Section */}
          <Card className="mb-8 shadow-xl border-0 overflow-hidden bg-white dark:bg-gray-900">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6">
              <h3 className="flex items-center gap-3 text-xl font-bold">
                <CreditCard className="w-6 h-6" />
                Transaction Confirmation
              </h3>
            </div>
            <CardContent className="p-6 bg-white dark:bg-gray-900">
              <div className="space-y-6">
                {/* Transaction ID - Full Width */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                    Transaction ID
                  </label>
                  <p className="font-mono text-sm text-gray-900 dark:text-gray-100 break-all">
                    {paymentData.sessionId}
                  </p>
                </div>

                {/* Payment Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Payment Date */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <label className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4" />
                      Payment Date
                    </label>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {formatPaymentDate(paymentData.createdAt)}
                    </p>
                  </div>

                  {/* Amount Paid */}
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <label className="text-sm font-medium text-green-600 dark:text-green-400 mb-2 block">
                      Amount Paid
                    </label>
                    <p className="text-xl font-bold text-green-700 dark:text-green-300">
                      ${paymentData.amount.toFixed(2)}{" "}
                      {paymentData.currency?.toUpperCase() || "USD"}
                    </p>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800 sm:col-span-2 lg:col-span-1">
                    <label className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-2 block">
                      Payment Method
                    </label>
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 px-3 py-1">
                      <CreditCard className="w-3 h-3 mr-2" />
                      Card Payment
                    </Badge>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="flex items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">
                        Payment Status
                      </p>
                      <p className="text-lg font-bold text-green-700 dark:text-green-300">
                        Successfully Completed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Information Section */}
          <Card className="mb-8 shadow-xl border-0 overflow-hidden bg-white dark:bg-gray-900">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6">
              <h3 className="flex items-center gap-3 text-xl font-bold">
                <BookOpen className="w-6 h-6" />
                Course Information
              </h3>
            </div>
            <CardContent className="p-6 bg-white dark:bg-gray-900">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Course Image */}
                <div className="md:w-1/3">
                  <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                    {course?.thumbnailUrl ? (
                      <Image
                        src={course.thumbnailUrl}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Course Details */}
                <div className="md:w-2/3 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {course?.title || "Course Title"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                      {course?.description || "Course description loading..."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>12 months access</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>Lifetime access</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Star className="w-4 h-4" />
                      <span>Certificate included</span>
                    </div>
                  </div>

                  <Link href={`/courses/${courseId}`}>
                    <Button
                      variant="outline"
                      className="w-full md:w-auto hover:scale-105 transition-transform duration-200"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Access Course
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call-to-Action Section */}
          <Card className="shadow-xl border-0 overflow-hidden">
            <CardContent className="p-8 bg-white dark:bg-gray-900">
              <div className="text-center space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Ready to start your learning journey?
                </h3>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href={`/courses/${courseId}/learn`}>
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                      <PlayCircle className="w-5 h-5 mr-2" />
                      Start Learning Now
                    </Button>
                  </Link>

                  <Link href="/help/getting-started">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto px-8 py-3 hover:scale-105 transition-all duration-200"
                    >
                      <BookOpen className="w-5 h-5 mr-2" />
                      Platform User Guide
                    </Button>
                  </Link>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Confirmation Email Sent
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        We have sent a confirmation email with the course
                        details to your inbox.
                        {/* {paymentData.customerEmail && (
                          <span className="font-medium block">
                            Sent to: {paymentData.customerEmail}
                          </span>
                        )} */}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
