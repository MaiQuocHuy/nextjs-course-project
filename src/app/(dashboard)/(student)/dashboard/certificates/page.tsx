import React from "react";
import { Award } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-student/DashboardLayout";
import { CertificatesClient } from "@/components/dashboard-student/certificates";

export default function CertificatesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6 p-1 md:p-0">
        {/* Page Header */}
        <div className="px-2 md:px-1">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">My Certificates</h1>
          </div>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            View and download your course completion certificates
          </p>
        </div>

        {/* Certificates Content */}
        <div className="px-1">
          <CertificatesClient />
        </div>
      </div>
    </DashboardLayout>
  );
}
