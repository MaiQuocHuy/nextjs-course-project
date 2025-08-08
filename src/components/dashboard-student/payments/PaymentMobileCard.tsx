"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useGetPaymentDetailQuery } from "@/services/student/studentApi";
import type { Payment } from "@/types/student";
import Image from "next/image";
import {
  ChevronDown,
  ChevronRight,
  CreditCard,
  Calendar,
  AlertCircle,
  ExternalLink,
  Hash,
  FileText,
} from "lucide-react";
import {
  formatCurrency,
  formatDate,
  getPaymentMethodDisplay,
  getPaymentStatusBadge,
} from "@/utils/student";

interface PaymentMobileCardProps {
  payment: Payment;
}

export function PaymentMobileCard({ payment }: PaymentMobileCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Only fetch payment detail when the card is expanded
  const {
    data: paymentDetail,
    isLoading: isDetailLoading,
    error: detailError,
  } = useGetPaymentDetailQuery(payment.id, {
    skip: !isExpanded,
  });

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="overflow-hidden py-1">
      <CardContent className="p-4 pb-2">
        {/* Main Content */}
        <div className="space-y-3">
          {/* Header Row */}
          <div className="flex items-start gap-3">
            {/* Course Thumbnail */}
            <div className="relative w-12 h-8 rounded overflow-hidden bg-gray-100 flex-shrink-0">
              <Image
                src={payment.course.thumbnailUrl}
                alt={payment.course.title}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>

            {/* Course Info & Status */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm line-clamp-2 mb-1 leading-tight">
                {payment.course.title}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground">
                  {formatDate(payment.createdAt)}
                </span>
              </div>
            </div>

            {/* Amount */}
            <div className="text-right flex-shrink-0">
              <div className="font-semibold text-sm">
                {formatCurrency(payment.amount, payment.currency)}
              </div>
              <div className="text-xs text-muted-foreground">
                {getPaymentMethodDisplay(payment.paymentMethod)}
              </div>
              {getPaymentStatusBadge(payment.status)}
            </div>
          </div>

          {/* Expand Button */}
          <div className="flex justify-center pt-2 border-t border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleExpanded}
              className="h-8 text-xs"
            >
              {isExpanded ? (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Less Details
                </>
              ) : (
                <>
                  <ChevronRight className="h-3 w-3 mr-1" />
                  More Details
                </>
              )}
            </Button>
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="pt-3 border-t border-gray-100">
              {isDetailLoading && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="space-y-1">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detailError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Failed to load payment details. Please try again.
                  </AlertDescription>
                </Alert>
              )}

              {paymentDetail && !isDetailLoading && (
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-gray-900 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Payment Details
                  </h4>

                  <div className="grid grid-cols-1 gap-4">
                    {/* Transaction ID */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Hash className="h-3 w-3 text-gray-400" />
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Transaction ID
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 font-mono break-all">
                        {paymentDetail.transactionId || "N/A"}
                      </p>
                    </div>

                    {/* Stripe Session ID */}
                    {paymentDetail.stripeSessionId && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Hash className="h-3 w-3 text-gray-400" />
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Session ID
                          </span>
                        </div>
                        <p className="text-sm text-gray-900 font-mono break-all">
                          {paymentDetail.stripeSessionId}
                        </p>
                      </div>
                    )}

                    {/* Card Information */}
                    {paymentDetail.card && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-3 w-3 text-gray-400" />
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Card Info
                          </span>
                        </div>
                        <p className="text-sm text-gray-900">
                          •••• {paymentDetail.card.last4} (
                          {paymentDetail.card.brand.toUpperCase()})
                        </p>
                        <p className="text-xs text-gray-500">
                          Expires{" "}
                          {paymentDetail.card.expMonth
                            .toString()
                            .padStart(2, "0")}
                          /{paymentDetail.card.expYear}
                        </p>
                      </div>
                    )}

                    {/* Receipt URL */}
                    {paymentDetail.receiptUrl && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3 text-gray-400" />
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Receipt
                          </span>
                        </div>
                        <a
                          href={paymentDetail.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          View Receipt
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}

                    {/* Created Date (Full) */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Created
                        </span>
                      </div>
                      <p className="text-sm text-gray-900">
                        {new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(paymentDetail.createdAt))}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
