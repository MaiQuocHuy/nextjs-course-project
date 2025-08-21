"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRequestRefundMutation } from "@/services/student/studentApi";
import { formatCurrency } from "@/utils/student";
import { toast } from "sonner";
import { Undo2, AlertCircle, CheckCircle, Loader2, Clock } from "lucide-react";
import type { Payment } from "@/types/student";

interface RefundDialogProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment;
}

interface RefundFormData {
  reason: string;
}

export function RefundDialog({ isOpen, onClose, payment }: RefundDialogProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [requestRefund, { isLoading, error }] = useRequestRefundMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<RefundFormData>({
    defaultValues: {
      reason: "",
    },
  });

  const reasonValue = watch("reason");

  // Calculate if refund is still allowed (within 3 days)
  const isRefundAllowed = () => {
    const paymentDate = new Date(payment.createdAt);
    const currentDate = new Date();
    const diffInDays = Math.floor(
      (currentDate.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffInDays <= 3 && payment.status === "COMPLETED";
  };

  const canRefund = isRefundAllowed();

  const onSubmit = (data: RefundFormData) => {
    setShowConfirmation(true);
  };

  const handleConfirmRefund = async () => {
    try {
      const response = await requestRefund({
        courseId: payment.course.id,
        data: { reason: reasonValue.trim() },
      }).unwrap();

      toast.success("Refund request submitted successfully");
      onClose();
      reset();
      setShowConfirmation(false);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.error || // RTK query network error
        "Failed to submit refund request";
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    reset();
    onClose();
  };

  const getDaysRemaining = () => {
    const paymentDate = new Date(payment.createdAt);
    const currentDate = new Date();
    const diffInDays = Math.floor(
      (currentDate.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(0, 3 - diffInDays);
  };

  return (
    <>
      <Dialog open={isOpen && !showConfirmation} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Undo2 className="h-5 w-5 text-orange-600" />
              Request Refund
            </DialogTitle>
            <DialogDescription>
              Submit a refund request for your course purchase
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Course Info */}
            <div className="p-4 bg-gray-50 rounded-lg border">
              <h4 className="font-medium text-sm text-gray-900 mb-2">
                Course Details
              </h4>
              <div className="space-y-1 text-sm">
                <p className="font-medium">{payment.course.title}</p>
                <p className="text-gray-600">
                  Amount: {formatCurrency(payment.amount, payment.currency)}
                </p>
                <p className="text-gray-600">
                  Purchased: {new Date(payment.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Refund Policy Alert */}
            {canRefund ? (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  You have {getDaysRemaining()} day(s) remaining to request a
                  refund for this course.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {payment.status !== "COMPLETED"
                    ? "Refunds are only available for completed payments."
                    : "Refund period has expired. Refunds must be requested within 3 days of purchase."}
                </AlertDescription>
              </Alert>
            )}

            {/* Reason Input */}
            {canRefund && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                <Label htmlFor="reason">Reason for refund *</Label>
                <Textarea
                  id="reason"
                  placeholder="Please explain why you want to request a refund..."
                  rows={4}
                  className={`resize-none ${
                    errors.reason ? "border-red-500" : ""
                  }`}
                  {...register("reason", {
                    required: "Please provide a reason for the refund request",
                    minLength: {
                      value: 10,
                      message: "Reason must be between 10 and 500 characters",
                    },
                    maxLength: {
                      value: 500,
                      message: "Reason must be between 10 and 500 characters",
                    },
                  })}
                />
                {errors.reason && (
                  <p className="text-xs text-red-500">
                    {errors.reason.message}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  {reasonValue?.length || 0}/500 characters
                </p>
              </form>
            )}

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {(error as any)?.data?.message ||
                    "Failed to submit refund request"}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            {canRefund && (
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading || !reasonValue?.trim() || !!errors.reason}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Request Refund
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Confirm Refund Request
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2" asChild>
              <div className="space-y-2">
                <div>
                  Are you sure you want to submit a refund request for{" "}
                  <strong>{payment.course.title}</strong>?
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Amount:</strong>{" "}
                  {formatCurrency(payment.amount, payment.currency)}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Reason:</strong> {reasonValue}
                </div>
                <div className="text-sm text-orange-600 mt-3">
                  Once submitted, your request will be reviewed by our team.
                  This action cannot be undone.
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmation(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRefund}
              disabled={isLoading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Submit Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
