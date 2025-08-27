import { DashboardLayout } from "@/components/dashboard-student/DashboardLayout";
import {
  PaymentStats,
  PaymentTable,
} from "@/components/dashboard-student/payments";

export default function PaymentsPageRoute() {
  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6 p-1 md:p-0">
        {/* Page Header */}
        <div className="px-2 md:px-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Payments
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            View your payment history and transaction details
          </p>
        </div>

        {/* Payment Statistics */}
        <div className="px-1">
          <PaymentStats />
        </div>

        {/* Payment History Table */}
        <div className="px-1">
          <PaymentTable />
        </div>
      </div>
    </DashboardLayout>
  );
}
