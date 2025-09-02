import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/types/instructor/dashboard';

export const GeneralStatistics = ({
  statsData,
}: {
  statsData?: DashboardStats | {};
}) => {
  return (
    <>
      {statsData && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(statsData).map((stat: any, index) => (
            <Link
              href={stat[1].href ? stat[1].href : '#'}
              key={index}
              target="_blank"
              className={!stat[1].href ? 'pointer-events-none' : ''}
            >
              <Card key={stat[1].title} className="shadow-card gap-3">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat[1].title}
                  </CardTitle>
                  <>{stat[1].icon}</>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat[1].value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat[1].description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};
