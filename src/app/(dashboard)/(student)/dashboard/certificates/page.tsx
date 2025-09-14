import React from "react";
import { Award } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-student/DashboardLayout";
import { CertificatesClient } from "@/components/dashboard-student/certificates";

export default function CertificatesPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold">My Certificates</h1>
          </div>
          <p className="text-gray-600">View and download your course completion certificates</p>
        </div>

        <CertificatesClient />
      </div>
    </DashboardLayout>
  );
}
