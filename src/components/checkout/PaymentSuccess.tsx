"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Download,
  BookOpen,
  ArrowRight,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface PaymentSuccessProps {
  courseId: string;
  courseTitle: string;
  orderNumber: string;
  amount: number;
  onClose?: () => void;
}

export function PaymentSuccess({
  courseId,
  courseTitle,
  orderNumber,
  amount,
  onClose,
}: PaymentSuccessProps) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Show details after animation
    const timer = setTimeout(() => setShowDetails(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white dark:bg-gray-900">
        <CardContent className="p-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600 animate-pulse" />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Payment Successful! 🎉
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Welcome to your new learning journey!
            </p>
          </div>

          {/* Order Details */}
          {showDetails && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Order Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Order Number:
                    </span>
                    <Badge variant="outline">{orderNumber}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Course:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white text-right flex-1 ml-2">
                      {courseTitle}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Amount Paid:
                    </span>
                    <span className="font-bold text-green-600">
                      ${amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* What's Next */}
              <div className="bg-blue-50 dark:bg-blue-950/50 rounded-lg p-4 text-left">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  What's Next?
                </h3>
                <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Access your course immediately
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Download course materials
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Track your progress
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Earn your certificate
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Link href={`/courses/${courseId}`} className="w-full">
              <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                <BookOpen className="w-5 h-5 mr-2" />
                Start Learning Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
              <Button variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Receipt
              </Button>
            </div>

            {onClose && (
              <Button variant="ghost" onClick={onClose} className="w-full">
                Close
              </Button>
            )}
          </div>

          {/* Email Confirmation */}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            A confirmation email has been sent to your registered email address
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
