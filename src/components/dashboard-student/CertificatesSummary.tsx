"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetMyCertificatesQuery } from "@/services/common/certificateApi";
import { Award, ExternalLink, Calendar, Eye } from "lucide-react";
import { formatDate } from "@/utils/formatDate";

export function CertificatesSummary() {
  const {
    data: certificatesData,
    isLoading,
    error,
  } = useGetMyCertificatesQuery({
    page: 0,
    size: 3, // Only get the latest 3 certificates for summary
    sort: "issuedAt,desc",
  });

  const certificates = certificatesData?.data.content || [];
  const totalCertificates = certificatesData?.data.page?.totalElements || 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" />
            My Certificates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" />
            My Certificates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">Unable to load certificates</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Award className="h-5 w-5 text-blue-600" />
          My Certificates
        </CardTitle>
        <Badge variant="secondary" className="ml-auto">
          {totalCertificates}
        </Badge>
      </CardHeader>
      <CardContent>
        {certificates.length === 0 ? (
          <div className="text-center py-6">
            <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-3">No certificates yet</p>
            <p className="text-xs text-gray-400">Complete courses to earn certificates</p>
          </div>
        ) : (
          <div className="space-y-3">
            {certificates.map((certificate) => (
              <div
                key={certificate.id}
                className="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {certificate.courseTitle}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {formatDate(certificate.issuedAt)}
                    </span>
                    <Badge
                      variant={
                        certificate.fileStatus === "GENERATED"
                          ? "default"
                          : certificate.fileStatus === "PENDING"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      {certificate.fileStatus}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="ml-2 h-8 w-8 p-0" asChild>
                  <Link href={`/certificates/${certificate.certificateCode}`}>
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View certificate</span>
                  </Link>
                </Button>
              </div>
            ))}

            {totalCertificates > 3 && (
              <div className="pt-2">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/dashboard/certificates">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View All Certificates ({totalCertificates})
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
