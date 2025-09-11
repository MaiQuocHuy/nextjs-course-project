import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function TableLoadingSkeleton() {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {Array.from({ length: 7 }).map((_, index) => (
              <th
                key={index}
                className="p-4 text-left font-medium text-muted-foreground"
              >
                <Skeleton className="h-4 w-24" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-t">
              {Array.from({ length: 7 }).map((_, cellIndex) => (
                <td key={cellIndex} className="p-4">
                  <Skeleton className="h-4 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DetailsLoadingSkeleton() {
  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6">
      {/* Back button skeleton */}
      <Skeleton className="h-10 w-24" />

      {/* Header card skeleton */}
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-5 w-64" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-24" /> {/* Status badge */}
              <Skeleton className="h-7 w-24" /> {/* Amount */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course and Student Information */}
      <div className="space-y-4 md:space-y-6">
        {/* Course Information Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" /> {/* Icon */}
              <Skeleton className="h-6 w-40" /> {/* Title */}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Course thumbnail skeleton */}
            <Skeleton className="w-full h-64 rounded" />
            <div className="flex justify-between items-center">
              <div className="space-y-3">
                <Skeleton className="h-7 w-64" /> {/* Course title */}
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="h-4 w-32" /> {/* Course ID */}
                  <Skeleton className="h-4 w-20" /> {/* Level badge */}
                  <Skeleton className="h-4 w-16" /> {/* Price */}
                </div>
              </div>
              <Skeleton className="h-10 w-28" /> {/* View course button */}
            </div>
          </CardContent>
        </Card>

        {/* Student Information Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" /> {/* Icon */}
              <Skeleton className="h-6 w-40" /> {/* Title */}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-2 md:space-x-3">
                <Skeleton className="h-12 w-12 rounded-full" /> {/* Avatar */}
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-5 w-40 mb-1" /> {/* Student name */}
                  <Skeleton className="h-4 w-48 mb-1" /> {/* Email */}
                  <Skeleton className="h-4 w-32" /> {/* ID */}
                </div>
              </div>
              <Skeleton className="h-10 w-28" /> {/* View student button */}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Details Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" /> {/* Icon */}
            <Skeleton className="h-6 w-48" /> {/* Title */}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" /> {/* Icon */}
                  <Skeleton className="h-5 w-32" /> {/* Label */}
                </div>
                <Skeleton className="h-5 w-40" /> {/* Value */}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Refund Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" /> {/* Icon */}
            <Skeleton className="h-6 w-48" /> {/* Title */}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Requested and processed dates */}
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" /> {/* Icon */}
                  <Skeleton className="h-5 w-32" /> {/* Label */}
                </div>
                <Skeleton className="h-5 w-48" /> {/* Date value */}
              </div>
            ))}
            {/* Reason */}
            <div className="space-y-2 md:col-span-2">
              <Skeleton className="h-5 w-32" /> {/* Label */}
              <Skeleton className="h-20 w-full" /> {/* Reason text area */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" /> {/* Icon */}
            <Skeleton className="h-6 w-48" /> {/* Title */}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Transaction details */}
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" /> {/* Icon */}
                  <Skeleton className="h-5 w-32" /> {/* Label */}
                </div>
                <Skeleton className="h-5 w-full" /> {/* Value */}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function RefundsSkeleton() {
  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>
      </div>

      {/* Search and Filters skeleton */}
      <Card>
        <CardContent className="px-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            {/* Search bar skeleton */}
            <Skeleton className="h-10 w-full lg:w-1/2" />
            
            {/* Filter bar skeleton */}
            <div className="flex flex-wrap gap-2 lg:justify-end">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-48" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Refetch button skeleton */}
      <div>
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Table skeleton */}
      <TableLoadingSkeleton />

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>
    </div>
  );
}
