import { DashboardLayout } from "@/components/dashboard-student/DashboardLayout";
import {
  AffiliatePayoutStats,
  AffiliatePayoutTable,
} from "@/components/dashboard-student/affiliate-payout";

export default function AffiliatePayoutPageRoute() {
  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6 p-1 md:p-0">
        {/* Page Header */}
        <div className="px-2 md:px-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Affiliate Payout
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Track your affiliate commissions and payout history
          </p>
        </div>

        {/* Affiliate Payout Statistics */}
        <div className="px-1">
          <AffiliatePayoutStats />
        </div>

        {/* Affiliate Payout History Table */}
        <div className="px-1">
          <AffiliatePayoutTable />
        </div>
      </div>
    </DashboardLayout>
  );
}
