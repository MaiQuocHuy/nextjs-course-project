"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// Mock course data - in real app, this would come from API
const mockCourse = {
  id: "1",
  title: "Complete Web Development Bootcamp with React and Node.js",
  thumbnail: "/api/placeholder/400/200",
  instructor: {
    name: "Sarah Johnson",
    avatar: "/api/placeholder/32/32",
  },
  price: 89.99,
  originalPrice: 129.99,
  rating: 4.8,
  studentsCount: 15420,
  duration: "42 hours",
  level: "Beginner to Advanced",
};

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id as string;

  if (!courseId) {
    return <div>Course not found</div>;
  }

  const [loading, setLoading] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [appliedPromoCode, setAppliedPromoCode] = useState("");

  // Calculate totals
  const vatRate = 0.1;
  const subtotal = mockCourse.price;
  const discountAmount =
    promoDiscount > 0 ? subtotal * (promoDiscount / 100) : 0;
  const discountedPrice = subtotal - discountAmount;
  const vatAmount = discountedPrice * vatRate;
  const total = discountedPrice + vatAmount;

  const handleCheckout = async () => {
    setLoading(true);

    try {
      // Simulate preparation for Stripe redirect
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Redirect to Stripe checkout page
      // For now, show a toast message
      toast.success("Redirecting to Stripe for payment...");

      // In the future, you would redirect to Stripe like this:
      // window.location.href = `/api/stripe/checkout?courseId=${courseId}&total=${total}`;
    } catch (error) {
      toast.error("Failed to initiate checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/courses/${courseId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Course
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Checkout
              </h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <OrderSummary
            course={mockCourse}
            vatRate={vatRate}
            promoCode={appliedPromoCode}
            promoDiscount={promoDiscount}
            onCheckout={handleCheckout}
            loading={loading}
          />
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400 dark:text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">256-bit SSL Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-600 rounded" />
              <span className="text-sm">PCI DSS Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-600 rounded" />
              <span className="text-sm">30-Day Money Back Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
