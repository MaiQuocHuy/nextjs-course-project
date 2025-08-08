"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Star, Clock, Users, Trophy, Lock, Loader2 } from "lucide-react";

interface Course {
  id: string;
  title: string;
  thumbnail: string;
  instructor: {
    name: string;
    avatar: string;
  };
  price: number;
  originalPrice?: number;
  rating: number;
  studentsCount: number;
  duration: string;
  level: string;
}

interface OrderSummaryProps {
  course: Course;
  vatRate?: number;
  promoCode?: string;
  promoDiscount?: number;
  onCheckout?: () => void;
  loading?: boolean;
}

export function OrderSummary({
  course,
  vatRate = 0.1,
  promoCode,
  promoDiscount = 0,
  onCheckout,
  loading = false,
}: OrderSummaryProps) {
  const subtotal = course.price;
  const discountAmount =
    promoDiscount > 0 ? subtotal * (promoDiscount / 100) : 0;
  const discountedPrice = subtotal - discountAmount;
  const vatAmount = discountedPrice * vatRate;
  const total = discountedPrice + vatAmount;

  return (
    <Card className="w-full shadow-xl border-0 bg-white dark:bg-gray-900">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Course Details */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-xl">
            <Image
              src={course.thumbnail}
              alt={course.title}
              width={400}
              height={200}
              className="w-full h-40 object-cover transition-transform hover:scale-105 duration-300"
            />
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-white/90 text-gray-900">
                {course.level}
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-lg leading-tight text-gray-900 dark:text-white line-clamp-2">
              {course.title}
            </h3>

            <div className="flex items-center gap-3">
              <Image
                src={course.instructor.avatar}
                alt={course.instructor.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {course.instructor.name}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{course.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{course.studentsCount.toLocaleString()} students</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{course.duration}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">
              Course Price
            </span>
            <div className="text-right">
              {course.originalPrice && course.originalPrice > course.price && (
                <span className="text-sm text-gray-400 line-through mr-2">
                  ${course.originalPrice}
                </span>
              )}
              <span className="font-medium text-gray-900 dark:text-white">
                ${subtotal.toFixed(2)}
              </span>
            </div>
          </div>

          {promoCode && promoDiscount > 0 && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-300">
                  Promo Code
                </span>
                <Badge variant="outline" className="text-xs">
                  {promoCode}
                </Badge>
              </div>
              <span className="font-medium text-green-600">
                -${discountAmount.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">
              VAT ({(vatRate * 100).toFixed(0)}%)
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              ${vatAmount.toFixed(2)}
            </span>
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Total
            </span>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Course Benefits */}
        <div className="bg-blue-50 dark:bg-blue-950/50 rounded-xl p-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-blue-600" />
            What's Included
          </h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              Lifetime access to course content
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              Downloadable resources and materials
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              Certificate of completion
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              30-day money-back guarantee
            </li>
          </ul>
        </div>

        {/* Checkout Button */}
        <div className="pt-4">
          <Button
            onClick={onCheckout}
            disabled={loading}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 mr-2" />
                Proceed to Payment ${total.toFixed(2)}
              </>
            )}
          </Button>

          {/* Security Note */}
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
            You will be redirected to Stripe for secure payment processing.
            <br />
            This is a secure 256-bit SSL encrypted payment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
