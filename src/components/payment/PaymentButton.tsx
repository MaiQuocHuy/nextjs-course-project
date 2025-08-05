"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCreateCheckoutSessionMutation } from "@/services/paymentApi";
import { ShoppingCart, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import getStripe from "@/lib/stripe";
import { cn } from "@/lib/utils";

interface PaymentButtonProps {
  courseId: string;
  courseTitle: string;
  price: number;
  isEnrolled?: boolean;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  fullWidth?: boolean;
}

export function PaymentButton({
  courseId,
  courseTitle,
  price,
  isEnrolled = false,
  className = "",
  variant = "default",
  size = "default",
  fullWidth = false,
}: PaymentButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [createCheckoutSession] = useCreateCheckoutSessionMutation();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handlePayment = async () => {
    // Check if user is logged in
    if (status === "unauthenticated") {
      toast.error("Please login to enroll in this course");
      router.push("/login");
      return;
    }

    if (status === "loading") {
      return;
    }

    // Check if already enrolled
    if (isEnrolled) {
      toast.info("You are already enrolled in this course");
      return;
    }

    setIsProcessing(true);

    try {
      // Create checkout session
      const response = await createCheckoutSession({
        courseId,
      }).unwrap();

      console.log("Checkout session created:", response);
      console.log("Response keys:", Object.keys(response));
      console.log("Session ID:", response.sessionId);
      console.log("Session URL:", response.sessionUrl);

      // Check if sessionId exists
      if (!response.sessionId) {
        console.error("No sessionId in response:", response);
        throw new Error("No session ID received from server");
      }

      // Get Stripe instance
      const stripe = await getStripe();

      if (!stripe) {
        throw new Error("Stripe failed to initialize");
      }

      console.log("Redirecting to Stripe with sessionId:", response.sessionId);

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.sessionId,
      });

      if (error) {
        console.error("Stripe redirect error:", error);
        throw new Error(error.message || "Failed to redirect to payment");
      }
    } catch (error: any) {
      console.error("Payment error:", error);

      let errorMessage = "Payment failed. Please try again.";

      if (
        error.message?.includes("authentication") ||
        error.message?.includes("unauthorized")
      ) {
        errorMessage = "Please login to continue with payment.";
        router.push("/login");
      } else if (error.message?.includes("not available")) {
        errorMessage = "This course is not available for purchase.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // If enrolled, show enrolled state
  if (isEnrolled) {
    return (
      <Button
        disabled
        variant="secondary"
        size={size}
        className={cn(
          "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400",
          fullWidth && "w-full",
          className
        )}
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Enrolled
      </Button>
    );
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={isProcessing || status === "loading"}
      variant={variant}
      size={size}
      className={cn(
        "transition-all duration-300",
        variant === "default" &&
          "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl",
        fullWidth && "w-full",
        className
      )}
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : status === "loading" ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Enroll Now - {formatPrice(price)}
        </>
      )}
    </Button>
  );
}

// Compact version for sidebars
export function CompactPaymentButton({
  courseId,
  courseTitle,
  price,
  isEnrolled = false,
  className = "",
}: Omit<PaymentButtonProps, "variant" | "size" | "fullWidth">) {
  return (
    <PaymentButton
      courseId={courseId}
      courseTitle={courseTitle}
      price={price}
      isEnrolled={isEnrolled}
      variant="default"
      size="lg"
      fullWidth
      className={className}
    />
  );
}

// Simple enrollment button without pricing display
export function EnrollmentButton({
  courseId,
  courseTitle,
  isEnrolled = false,
  className = "",
}: Omit<PaymentButtonProps, "price" | "variant" | "size" | "fullWidth">) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [createCheckoutSession] = useCreateCheckoutSessionMutation();

  const handleEnrollment = async () => {
    if (status === "unauthenticated") {
      toast.error("Please login to enroll in this course");
      router.push("/login");
      return;
    }

    if (isEnrolled) {
      toast.info("You are already enrolled in this course");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await createCheckoutSession({
        courseId,
      }).unwrap();

      const stripe = await getStripe();
      if (!stripe) {
        throw new Error("Stripe failed to initialize");
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: response.sessionId,
      });

      if (error) {
        throw new Error(error.message || "Failed to redirect to payment");
      }
    } catch (error: any) {
      console.error("Enrollment error:", error);
      toast.error(error.message || "Enrollment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isEnrolled) {
    return (
      <Button
        disabled
        variant="secondary"
        className={cn(
          "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400",
          className
        )}
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Enrolled
      </Button>
    );
  }

  return (
    <Button
      onClick={handleEnrollment}
      disabled={isProcessing || status === "loading"}
      className={cn("bg-blue-600 hover:bg-blue-700 text-white", className)}
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Enroll Now
        </>
      )}
    </Button>
  );
}
