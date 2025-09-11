import { DashboardLayout } from "@/components/dashboard-student/DashboardLayout";
import { DiscountUsageTable } from "@/components/dashboard-student/discount-usage";

export default function DiscountUsagePageRoute() {
  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6 p-1 md:p-0">
        {/* Page Header */}
        <div className="px-2 md:px-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Discount Usage
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            View your discount codes usage history and savings
          </p>
        </div>

        {/* Discount Usage History Table */}
        <div className="px-1">
          <DiscountUsageTable />
        </div>
      </div>
    </DashboardLayout>
  );
}
