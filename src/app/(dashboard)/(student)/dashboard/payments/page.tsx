"use client";

import { DashboardLayout } from "@/components/dashboard-student/DashboardLayout";
import { PaymentsPage } from "@/components/dashboard-student/payments/PaymentsPage";

export default function PaymentsPageRoute() {
  return (
    <DashboardLayout>
      <PaymentsPage />
    </DashboardLayout>
  );
}
