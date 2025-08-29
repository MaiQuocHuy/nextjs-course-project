import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { MonthlyRevenue } from '@/types/instructor/dashboard';

interface RevenueStatisticsProps {
  revenueStatistics?: MonthlyRevenue[];
}

export const RevenueStatistics = ({
  revenueStatistics,
}: RevenueStatisticsProps) => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Monthly Revenue</CardTitle>
        <CardDescription>Your earnings over the last 3 months</CardDescription>
      </CardHeader>
      <CardContent>
        {revenueStatistics && revenueStatistics.length > 0 ? (
          <>
            <div className="space-y-4">
              {revenueStatistics
                .slice(
                  0,
                  revenueStatistics.length > 3 ? 3 : revenueStatistics.length
                )
                .map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
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
                      <TrendingUp className="h-4 w-4 text-success" />
                    </div>
                  </div>
                ))}
            </div>
            <Link href="/instructor/earnings">
              <Button variant="outline" className="w-full mt-4 cursor-pointer">
                <DollarSign className="mr-2 h-4 w-4" />
                View Detailed Analytics
              </Button>
            </Link>
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">
              No revenue data available
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
