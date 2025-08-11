"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  XCircle,
  ArrowLeft,
  ShoppingCart,
  Home,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

interface CancelPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function CourseCancelPage(props: CancelPageProps) {
  const params = use(props.params);
  const searchParams = use(props.searchParams);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const courseId = params.id;
  const sessionId = Array.isArray(searchParams.session_id)
    ? searchParams.session_id[0]
    : searchParams.session_id;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="w-12 h-12 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-orange-800 dark:text-orange-400 mb-2">
                  Payment Cancelled
                </h1>
                <p className="text-lg text-orange-700 dark:text-orange-300">
                  Your payment was cancelled. No charges were made to your
                  account.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400 mb-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">What happened?</span>
                </div>
                <p className="text-sm text-yellow-600 dark:text-yellow-500">
                  The payment process was cancelled before completion. This
                  could be due to:
                </p>
                <ul className="text-sm text-yellow-600 dark:text-yellow-500 mt-2 ml-4 list-disc">
                  <li>
                    You clicked the back button or closed the payment window
                  </li>
                  <li>Payment timeout or session expired</li>
                  <li>Network connectivity issues</li>
                </ul>
              </div>

              {sessionId && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                    Session Information
                  </h3>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Session ID:
                      </span>
                      <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {sessionId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Course ID:
                      </span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {courseId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Date:
                      </span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold mb-4">
                What would you like to do?
              </h3>

              <div className="space-y-3">
                <Button asChild size="lg" className="w-full h-14">
                  <Link href={`/courses/${courseId}`}>
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Return to Course & Try Again
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  asChild
                  size="lg"
                  className="w-full h-12"
                >
                  <Link href="/courses">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Browse Other Courses
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  asChild
                  size="lg"
                  className="w-full h-12"
                >
                  <Link href="/">
                    <Home className="w-5 h-5 mr-2" />
                    Go to Homepage
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <h3 className="font-semibold text-blue-800 dark:text-blue-400">
                Need Help?
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                If you're experiencing issues with payment, our support team is
                here to help.
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/help">Help Center</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
