import { useParams, useRouter } from 'next/navigation';

import {
  ArrowLeft,
  User,
  BookOpen,
  CreditCard,
  Calendar,
  DollarSign,
  Hash,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DetailsLoadingSkeleton } from '@/components/instructor/refunds/shared/LoadingSkeleton';
import {
  formatCurrency,
  formatDateTime,
  getStatusVariant,
} from '@/utils/instructor/refunds';
import { DetailsLoadingError } from '@/components/instructor/refunds/shared/LoadingError';
import { useGetRefundByIdQuery } from '@/services/instructor/refunds/refunds-ins-api';

export const RefundDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, error, refetch } = useGetRefundByIdQuery(id, {
    skip: !id,
  });

  if (isLoading) {
    return <DetailsLoadingSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="container mx-auto p-4 lg:p-6 space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/instructor/refunds')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Refunds
        </Button>
        <DetailsLoadingError onRetry={() => refetch()} />
      </div>
    );
  }

  const refund = data.data;

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => router.push('/instructor/refunds')}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Refunds
      </Button>

      {/* Header */}
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-lg lg:text-xl font-bold tracking-tight">
                Refund Details
              </h1>
              <p className="text-muted-foreground">
                Refund ID: <span className="font-mono">{refund.id}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={getStatusVariant(refund.status)}
                className="text-base"
              >
                {refund.status}
              </Badge>
              <span className="text-xl font-semibold">
                {formatCurrency(refund.amount)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Refund Information Grid */}
      <div className="space-y-4 md:space-y-6 ">
        {/* Course Information */}
        <Card className="gap-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm md:text-base">
              <BookOpen className="h-4 w-4 md:h-5 md:w-5" />
              Course Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <img
              src={refund.payment.course.thumbnailUrl}
              alt={refund.payment.course.title}
              className="w-full max-h-[45vh] object-cover rounded"
            />
            <div className="flex justify-between items-center">
              <div className="space-y-3">
                <p className="font-medium sm:text-sm md:text-base lg:text-xl leading-tight line-clamp-2">
                  {refund.payment.course.title}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    Course ID: {refund.payment.course.id}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {refund.payment.course.level}
                  </Badge>
                  <span className="text-xs md:text-sm font-medium">
                    {formatCurrency(refund.payment.course.price)}
                  </span>
                </div>
              </div>

              {/* View Course Detail */}
              <Button
                variant="outline"
                onClick={() =>
                  router.push(`/instructor/courses/${refund.payment.course.id}`)
                }
              >
                View Course
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* User Information */}
        <Card className="gap-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm md:text-base">
              <User className="h-4 w-4 md:h-5 md:w-5" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-2 md:space-x-3">
                <Avatar className="h-10 w-10 md:h-12 md:w-12 flex-shrink-0">
                  <AvatarImage
                    src={refund.payment.user.thumbnailUrl}
                    alt={refund.payment.user.name}
                  />
                  <AvatarFallback className="text-xs md:text-sm">
                    {refund.payment.user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm md:text-base truncate">
                    {refund.payment.user.name}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground truncate">
                    {refund.payment.user.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ID: {refund.payment.user.id}
                  </p>
                </div>
              </div>

              {/* View Student Information */}
              <Button
                variant="outline"
                onClick={() =>
                  router.push(`/instructor/students/${refund.payment.user.id}`)
                }
              >
                View Student
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* <div className="grid grid-cols-1 md:grid-cols-5 xl:grid-cols-5 gap-4 md:gap-6">
      </div> */}

      {/* Original Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Original Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Payment ID */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Payment ID</span>
              </div>
              <p className="text-sm font-mono">{refund.payment.id}</p>
            </div>

            {/* Payment Amount */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Payment Amount</span>
              </div>
              <p className="text-sm">
                {formatCurrency(refund.payment.amount, refund.payment.currency)}
              </p>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Payment Method</span>
              </div>
              <p className="text-sm capitalize">
                {refund.payment.paymentMethod}
              </p>
            </div>

            {/* Payment Status */}
            <div className="space-y-2">
              <span className="text-sm font-medium">Payment Status</span>
              <div>
                <Badge variant={getStatusVariant(refund.payment.status)}>
                  {refund.payment.status}
                </Badge>
              </div>
            </div>

            {/* Payment Created */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Payment Created</span>
              </div>
              <p className="text-sm">
                {formatDateTime(refund.payment.createdAt)}
              </p>
            </div>

            {/* Payment Paid */}
            {refund.payment.paidAt && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Paid At</span>
                </div>
                <p className="text-sm">
                  {formatDateTime(refund.payment.paidAt)}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Refund Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Refund Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Requested Date */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Requested At</span>
              </div>
              <p className="text-sm">{formatDateTime(refund.requestedAt)}</p>
            </div>

            {/* Processed Date */}
            {refund.processedAt && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Processed At</span>
                </div>
                <p className="text-sm">{formatDateTime(refund.processedAt)}</p>
              </div>
            )}

            {/* Refund Reason */}
            <div className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium">Refund Reason</span>
              <p className="text-sm bg-muted p-3 rounded-md">{refund.reason}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Information */}
      {(refund.payment.transactionId ||
        refund.payment.stripeSessionId ||
        refund.payment.receiptUrl) && (
        <Card className="gap-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Transaction Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Transaction ID */}
              {refund.payment.transactionId && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Transaction ID</span>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-xs font-mono text-ellipsis overflow-hidden whitespace-nowrap">
                        {refund.payment.transactionId}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      {refund.payment.transactionId}
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}

              {/* Stripe Session ID */}
              {refund.payment.stripeSessionId && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Stripe Session:</span>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-xs font-mono text-ellipsis overflow-hidden whitespace-nowrap">
                        {refund.payment.stripeSessionId}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      {refund.payment.stripeSessionId}
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}

              {/* Receipt URL */}
              {refund.payment.receiptUrl && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Receipt</span>
                  </div>
                  <a
                    href={refund.payment.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Receipt
                  </a>
                </div>
              )}

              {/* Card Information */}
              {/* {refund.payment.card && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Card</span>
                  </div>
                  <p className="text-sm">
                    {refund.payment.card.brand.toUpperCase()} ****{' '}
                    {refund.payment.card.last4}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Expires{' '}
                    {refund.payment.card.expMonth.toString().padStart(2, '0')}/
                    {refund.payment.card.expYear}
                  </p>
                </div>
              )} */}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
