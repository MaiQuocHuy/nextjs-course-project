"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  useCreateReferralDiscountMutation,
  useGetUserReferralDiscountQuery,
} from "@/services/paymentApi";
import { toast } from "sonner";
import {
  Gift,
  Copy,
  Loader2,
  Users,
  Calendar,
  Percent,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ReferralDiscountData {
  id: string;
  code: string;
  discountPercent: number;
  description: string;
  type: string;
  ownerUser: {
    id: string;
    name: string;
    email: string;
  };
  perUserLimit: number;
  isActive: boolean;
  currentUsageCount: number;
}

export function ReferralDiscountCard() {
  const [referralData, setReferralData] = useState<ReferralDiscountData | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);

  // API hooks
  const [createReferralDiscount] = useCreateReferralDiscountMutation();
  const {
    data: existingReferralData,
    isLoading: isLoadingExisting,
    error: loadError,
  } = useGetUserReferralDiscountQuery();

  // Debug log để xem lỗi chi tiết
  useEffect(() => {
    if (loadError) {
      // console.error("Referral discount load error:", loadError);
      // console.error("Error status:", (loadError as any)?.status);
      // console.error("Error data:", (loadError as any)?.data);
    }
  }, [loadError]);

  // Load existing referral data on component mount
  useEffect(() => {
    if (existingReferralData) {
      setReferralData(existingReferralData);
    }
  }, [existingReferralData]);

  // Check if error is 404 (user doesn't have referral code yet)
  // RTK Query error format: error.status for HTTP status
  const hasNoReferralCode =
    loadError &&
    ((loadError as any)?.status === 404 ||
      (loadError as any)?.originalStatus === 404 ||
      (loadError as any)?.data?.status === 404);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Copy discount code to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Discount code copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy discount code");
    }
  };

  // Create referral discount code
  const handleCreateReferralCode = async () => {
    setIsCreating(true);
    try {
      const result = await createReferralDiscount({}).unwrap();
      setReferralData(result);
      toast.success("Referral discount code created successfully!");
    } catch (error: any) {
      // console.error("Create referral error:", error);

      let errorMessage = "Failed to create referral code. Please try again.";

      if (error.status === 400) {
        errorMessage =
          error.data?.message ||
          "Invalid request. You may already have an active referral code.";
      } else if (error.status === 401) {
        errorMessage = "Please login to create a referral code.";
      } else if (error.status === 403) {
        errorMessage = "You don't have permission to create referral codes.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Gift className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-lg">Referral Discount Code</CardTitle>
            <CardDescription>
              Create your personal referral code to share with friends and earn
              rewards
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {isLoadingExisting ? (
          // Loading state
          <div className="text-center space-y-4">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-100">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Loading Your Referral Code
              </h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Checking if you already have a referral code...
              </p>
            </div>
          </div>
        ) : !referralData && !isLoadingExisting ? (
          // No referral data - show create button (covers 404 and no data cases)
          <div className="text-center space-y-4">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-100">
              <div className="mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Get Your Referral Code
                </h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Create a personal discount code to share with friends. When
                  they use your code, you both get benefits!
                </p>
              </div>

              <Button
                onClick={handleCreateReferralCode}
                disabled={isCreating || isLoadingExisting}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4 mr-2" />
                    Generate Referral Code
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : loadError && referralData === null ? (
          // Error state (not 404)
          <div className="text-center space-y-4">
            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Unable to Load Referral Code
              </h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                There was an error loading your referral code. Please try again
                later.
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : referralData ? (
          // Display existing referral code
          <div className="space-y-6">
            {/* Referral Code Display */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium text-gray-700">
                  Your Referral Code
                </Label>
                <Badge
                  variant={referralData.isActive ? "default" : "destructive"}
                  className={cn(
                    "text-xs",
                    referralData.isActive
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : "bg-red-100 text-red-800 hover:bg-red-100"
                  )}
                >
                  {referralData.isActive ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Inactive
                    </>
                  )}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  value={referralData.code}
                  readOnly
                  className="font-mono text-lg font-bold bg-white border-purple-200 text-purple-700"
                />
                <Button
                  onClick={() => copyToClipboard(referralData.code)}
                  variant="outline"
                  size="icon"
                  className="border-purple-200 hover:bg-purple-50"
                >
                  <Copy className="h-4 w-4 text-purple-600" />
                </Button>
              </div>
            </div>

            {/* Referral Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Percent className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Discount
                  </span>
                </div>
                <p className="text-2xl font-bold text-green-700">
                  {referralData.discountPercent}%
                </p>
                <p className="text-xs text-green-600 mt-1">Off for friends</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Usage
                  </span>
                </div>
                <p className="text-2xl font-bold text-blue-700">
                  {referralData.currentUsageCount}/20
                </p>
                <p className="text-xs text-blue-600 mt-1">Times used</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">
                    User Limit
                  </span>
                </div>
                <p className="text-2xl font-bold text-purple-700">
                  {referralData.perUserLimit}
                </p>
                <p className="text-xs text-purple-600 mt-1">Per user max</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                How it works
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Share your referral code with friends</li>
                <li>
                  • They get {referralData.discountPercent}% off their course
                  purchase
                </li>
                <li>• You earn rewards when they use your code</li>
                <li>
                  • Each person can use your code up to{" "}
                  {referralData.perUserLimit} time(s)
                </li>
              </ul>

              {/* Owner Info */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  <span className="font-medium">Code owner:</span>{" "}
                  {referralData.ownerUser.name}
                </p>
                <p className="text-xs text-gray-500">
                  <span className="font-medium">Description:</span>{" "}
                  {referralData.description}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
