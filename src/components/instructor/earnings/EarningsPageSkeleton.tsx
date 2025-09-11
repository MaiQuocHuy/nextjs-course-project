import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, Wallet, BookOpen } from 'lucide-react';

const EarningsPageSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-80" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Total Earnings */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-28" />
              <DollarSign className="h-4 w-4 text-muted" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>

          {/* Paid Amount */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-28" />
              <Wallet className="h-4 w-4 text-muted" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>

          {/* Total Transactions */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-28" />
              <BookOpen className="h-4 w-4 text-muted" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 gap-2">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {/* Course filter */}
              <div className="col-span-2 space-y-2">
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* From date */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* To date */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Sort filter */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="mt-6">
                {/* Clear filters */}
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Table */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-36 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase bg-muted/50">
                <tr>
                  {/* Table headers */}
                  {Array(6).fill(0).map((_, index) => (
                    <th key={index} scope="col" className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-20" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Table rows */}
                {Array(5).fill(0).map((_, index) => (
                  <tr key={index} className="border-b">
                    {/* Course column */}
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-10 w-10 rounded" />
                        <div>
                          <Skeleton className="h-5 w-32 mb-1" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-4 text-right">
                      <Skeleton className="h-4 w-20 ml-auto" />
                    </td>

                    {/* Platform Cut */}
                    <td className="px-4 py-4 text-right">
                      <Skeleton className="h-4 w-20 ml-auto" />
                    </td>

                    {/* Your Share */}
                    <td className="px-4 py-4 text-right">
                      <Skeleton className="h-4 w-20 ml-auto" />
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 text-center">
                      <Skeleton className="h-6 w-20 mx-auto rounded-full" />
                    </td>
                    
                    {/* Date */}
                    <td className="px-4 py-4 text-right">
                      <Skeleton className="h-4 w-24 ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <Skeleton className="h-8 w-64" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsPageSkeleton;
