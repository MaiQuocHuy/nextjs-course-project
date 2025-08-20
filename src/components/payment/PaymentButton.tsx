"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCreateCheckoutSessionMutation } from "@/services/paymentApi";
import { ShoppingCart, Loader2, CheckCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import getStripe from "@/lib/stripe";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

// Alert Dialog Component for Already Enrolled
function AlreadyEnrolledDialog({
  open,
  onOpenChange,
  courseTitle,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseTitle: string;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Already Enrolled</AlertDialogTitle>
          <AlertDialogDescription>
            You have already enrolled in this course "{courseTitle}". You can
            access the course content and continue learning.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => onOpenChange(false)}>
            Got it
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Main Payment Button Component
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
  const [showAlreadyEnrolledDialog, setShowAlreadyEnrolledDialog] =
    useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Handle payment process
  const handlePayment = async () => {
    try {
      // 1. Check if already enrolled
      if (isEnrolled) {
        setShowAlreadyEnrolledDialog(true);
        return;
      }

      // 2. Check authentication
      if (status === "unauthenticated") {
        toast.error("Please login to enroll in this course");
        router.push("/login");
        return;
      }

      if (status === "loading") {
        toast.info("Please wait while we verify your session...");
        return;
      }

      // 3. Start processing
      setIsProcessing(true);

      // 4. Create checkout session
      const response = await createCheckoutSession({ courseId }).unwrap();

      // 5. Initialize Stripe
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error("Payment system is currently unavailable");
      }

      // 6. Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.sessionId,
      });

      if (error) {
        throw new Error(error.message || "Failed to redirect to payment");
      }
    } catch (error: any) {
      if (error instanceof Error) {
        console.error("Payment error:", error.message, error);
      } else if (typeof error === "object" && error !== null) {
        console.error("Payment error:", JSON.stringify(error), error);
      } else {
        console.error("Payment error:", error);
      }

      // Handle different error types
      let errorMessage = "Payment failed. Please try again.";

      if (error.status === 400) {
        if (
          error.data?.message?.includes("already purchased") ||
          error.data?.message?.includes("already enrolled")
        ) {
          setShowAlreadyEnrolledDialog(true);
          return;
        }
        errorMessage =
          error.data?.message ||
          "Invalid request. Please check course availability.";
      } else if (error.status === 401) {
        errorMessage = "Please login to continue with payment.";
        router.push("/login");
      } else if (error.status === 403) {
        errorMessage =
          "You don't have permission to purchase courses. Please contact support.";
      } else if (error.status === 404) {
        errorMessage = "Course not found or no longer available.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Render enrolled state
  if (isEnrolled) {
    return (
      <>
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

        <AlreadyEnrolledDialog
          open={showAlreadyEnrolledDialog}
          onOpenChange={setShowAlreadyEnrolledDialog}
          courseTitle={courseTitle}
        />
      </>
    );
  }

  // Render payment button
  return (
    <>
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
            Enroll Now
          </>
        )}
      </Button>

      <AlreadyEnrolledDialog
        open={showAlreadyEnrolledDialog}
        onOpenChange={setShowAlreadyEnrolledDialog}
        courseTitle={courseTitle}
      />
    </>
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
  const [showAlreadyEnrolledDialog, setShowAlreadyEnrolledDialog] =
    useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();

  const handleEnrollment = async () => {
    try {
      // Check if already enrolled
      if (isEnrolled) {
        setShowAlreadyEnrolledDialog(true);
        return;
      }

      // Check authentication
      if (status === "unauthenticated") {
        toast.error("Please login to enroll in this course");
        router.push("/login");
        return;
      }

      if (status === "loading") {
        toast.info("Please wait while we verify your session...");
        return;
      }

      // Start processing
      setIsProcessing(true);

      // Create checkout session
      const response = await createCheckoutSession({ courseId }).unwrap();

      // Initialize Stripe
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error("Payment system is currently unavailable");
      }

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.sessionId,
      });

      if (error) {
        throw new Error(error.message || "Failed to redirect to payment");
      }
    } catch (error: any) {
      console.error("Enrollment error:", error);

      let errorMessage = "Enrollment failed. Please try again.";

      if (error.status === 400) {
        if (
          error.data?.message?.includes("already purchased") ||
          error.data?.message?.includes("already enrolled")
        ) {
          setShowAlreadyEnrolledDialog(true);
          return;
        }
        errorMessage =
          error.data?.message ||
          "Invalid request. Please check course availability.";
      } else if (error.status === 401) {
        errorMessage = "Please login to continue.";
        router.push("/login");
      } else if (error.status === 403) {
        errorMessage = "You don't have permission to enroll in courses.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Render enrolled state
  if (isEnrolled) {
    return (
      <>
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

        <AlreadyEnrolledDialog
          open={showAlreadyEnrolledDialog}
          onOpenChange={setShowAlreadyEnrolledDialog}
          courseTitle={courseTitle}
        />
      </>
    );
  }

  // Render enrollment button
  return (
    <>
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
        ) : status === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Enroll Now
          </>
        )}
      </Button>

      <AlreadyEnrolledDialog
        open={showAlreadyEnrolledDialog}
        onOpenChange={setShowAlreadyEnrolledDialog}
        courseTitle={courseTitle}
      />
    </>
  );
}
