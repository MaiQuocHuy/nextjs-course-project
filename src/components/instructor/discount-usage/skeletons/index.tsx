import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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

export function DiscountUsagesSkeleton() {
  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>
      </div>

      {/* Search and Filters skeleton */}
      <Card>
        <CardContent className="px-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <Skeleton className="h-10 w-80" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-48" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table skeleton */}
      <Card>
        <CardContent className="p-0">
          <TableLoadingSkeleton />
        </CardContent>
      </Card>
    </div>
  );
}
