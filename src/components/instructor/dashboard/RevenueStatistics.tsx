import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, LineChart, TrendingUp } from 'lucide-react';
import { MonthlyRevenue } from '@/types/instructor/dashboard';
import { EmptyState } from '@/components/instructor/commom/EmptyState';

interface RevenueStatisticsProps {
  revenueStatistics?: MonthlyRevenue[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const RevenueStatistics = ({
  revenueStatistics,
  onRefresh,
}: RevenueStatisticsProps) => {
  return (
    <Card className="shadow-card gap-3">
      <CardHeader>
        <CardTitle>Monthly Revenue</CardTitle>
        <CardDescription>Your earnings over the last 3 months</CardDescription>
      </CardHeader>
      <CardContent>
        {revenueStatistics && revenueStatistics.length > 0 ? (
          <>
            <div className="space-y-1">
              {revenueStatistics
                .slice(
                  0,
                  revenueStatistics.length > 3 ? 3 : revenueStatistics.length
                )
                .map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between hover:bg-accent px-3 min-h-[56px] rounded-md transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {item.month}/{item.year}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">
                        ${Math.floor(item.revenue)}
                      </span>
                      {Math.floor(item.revenue) > 0 ? (
                        <TrendingUp className="h-4 w-4 text-success" />
                      ) : null}
                    </div>
                  </div>
                ))}

              <Link href="/instructor/earnings" className="w-full">
                <Button
                  variant="outline"
                  className="w-full mt-4 cursor-pointer"
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  View Detailed Analytics
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <EmptyState
            title="No revenue yet"
            message="You haven't generated any revenue yet. Once your courses start selling, your earnings will appear here."
            icon={<LineChart className="h-6 w-6 text-muted-foreground" />}
            showRetry={!!onRefresh}
            retryLabel="Refresh Revenue Data"
            onRetry={onRefresh}
            className="py-4"
          />
        )}
      </CardContent>
    </Card>
  );
};
