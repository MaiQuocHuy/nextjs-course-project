"use client";

import { useState, useEffect } from "react";
import { useValidateDiscountMutation } from "@/services/paymentApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  Gift,
  DollarSign,
  Tag,
  Loader2,
} from "lucide-react";

interface DiscountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string | number;
  courseTitle: string;
  originalPrice: number;
  onDiscountApplied: (data: {
    discountCode: string;
    finalPrice: number;
    discountAmount: number;
    discountPercent: number;
  }) => void;
  onContinueWithoutDiscount: () => void;
}

interface ValidateDiscountResponse {
  isValid: boolean;
  message?: string;
  finalPrice?: number;
  discountAmount?: number;
  discountPercent?: number;
}

export default function DiscountDialog({
  open,
  onOpenChange,
  courseId,
  courseTitle,
  originalPrice,
  onDiscountApplied,
  onContinueWithoutDiscount,
}: DiscountDialogProps) {
  const [discountCode, setDiscountCode] = useState("");
  const [validationResult, setValidationResult] =
    useState<ValidateDiscountResponse | null>(null);
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const [validateDiscount] = useValidateDiscountMutation();

  // Format price to USD with 2 decimal places
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Debounced validation effect
  useEffect(() => {
    if (!discountCode.trim()) {
      setValidationResult(null);
      return;
    }

    setIsValidatingCode(true);
    const timer = setTimeout(async () => {
      try {
        const result = await validateDiscount({
          courseId: String(courseId),
          discountCode: discountCode.trim(),
        }).unwrap();
        setValidationResult(result);
      } catch (error) {
        setValidationResult({
          isValid: false,
          message: "Failed to validate discount code",
        });
      } finally {
        setIsValidatingCode(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [discountCode, courseId, validateDiscount]);

  const handleInputChange = (value: string) => {
    setDiscountCode(value);
    if (!value.trim()) {
      setValidationResult(null);
    }
  };

  const handleApplyDiscount = async () => {
    if (!validationResult?.isValid || !validationResult.finalPrice) return;

    setIsApplying(true);
    try {
      onDiscountApplied({
        discountCode: discountCode.trim(),
        finalPrice: validationResult.finalPrice,
        discountAmount: validationResult.discountAmount || 0,
        discountPercent: validationResult.discountPercent || 0,
      });
      toast.success("Discount applied successfully!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to apply discount");
    } finally {
      setIsApplying(false);
    }
  };

  const handleContinueWithoutDiscount = () => {
    onContinueWithoutDiscount();
    onOpenChange(false);
  };

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setDiscountCode("");
      setValidationResult(null);
      setIsValidatingCode(false);
      setIsApplying(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-[90vw] md:w-[500px] lg:w-[520px] max-w-[600px] mx-auto max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="p-1.5 bg-blue-100 rounded-lg flex-shrink-0">
              <Gift className="h-4 w-4 text-blue-600" />
            </div>
            <span className="truncate">Apply Discount Code</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Enter your discount code to get a special price for{" "}
            <span className="font-medium">{courseTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Price Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3 border">
            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <DollarSign className="h-4 w-4 flex-shrink-0" />
              <span>Course Price</span>
            </h4>

            {validationResult?.isValid &&
            validationResult.finalPrice !== undefined ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Original Price</span>
                  <span className="text-base text-gray-500 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-600">
                    Discount ({validationResult.discountPercent}%)
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    -{formatPrice(validationResult.discountAmount || 0)}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-base font-semibold">Final Price</span>
                  <span className="text-xl font-bold text-green-600">
                    {formatPrice(validationResult.finalPrice)}
                  </span>
                </div>
                <div className="bg-green-100 text-green-700 text-sm p-3 rounded text-center font-medium">
                  ✓ You save {formatPrice(validationResult.discountAmount || 0)}
                  !
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold">Price</span>
                <span className="text-lg font-bold">
                  {formatPrice(originalPrice)}
                </span>
              </div>
            )}
          </div>

          {/* Discount Input Form */}
          <div className="space-y-4">
            <Label
              htmlFor="discount-code"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Tag className="h-4 w-4 flex-shrink-0" />
              <span>Discount Code</span>
            </Label>
            <div className="relative">
              <Input
                id="discount-code"
                placeholder="Enter discount code..."
                value={discountCode}
                onChange={(e) => handleInputChange(e.target.value)}
                className={`pr-10 h-11 ${
                  validationResult?.isValid === false
                    ? "border-red-300 focus:border-red-500"
                    : validationResult?.isValid === true
                    ? "border-green-300 focus:border-green-500"
                    : ""
                }`}
                maxLength={20}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {isValidatingCode ? (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                ) : validationResult?.isValid === true ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : validationResult?.isValid === false ? (
                  <XCircle className="h-4 w-4 text-red-500" />
                ) : null}
              </div>
            </div>

            {/* Validation Messages */}
            {!isValidatingCode && validationResult && (
              <div
                className={`text-sm p-3 rounded flex items-start gap-2 ${
                  validationResult.isValid
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {validationResult.isValid ? (
                  <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                )}
                <span className="text-sm leading-relaxed">
                  {validationResult.message ||
                    (validationResult.isValid
                      ? "Discount applied successfully"
                      : "Invalid discount code or discount has expired")}
                </span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3 pt-6 mt-6 border-t">
          <Button
            variant="outline"
            onClick={handleContinueWithoutDiscount}
            disabled={isApplying}
            className="w-full sm:w-auto order-2 sm:order-1 h-11"
          >
            {isApplying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Continue without discount"
            )}
          </Button>
          <Button
            onClick={handleApplyDiscount}
            disabled={
              !discountCode.trim() ||
              isValidatingCode ||
              !validationResult?.isValid ||
              isApplying
            }
            className="w-full sm:w-auto order-1 sm:order-2 h-11 bg-green-600 hover:bg-green-700 text-white"
          >
            {isApplying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Applying...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Apply Discount & Continue
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
