"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetCertificateByCodeQuery } from "@/services/common/certificateApi";
import {
  Award,
  Calendar,
  User,
  Mail,
  BookOpen,
  Download,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Eye,
} from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function PublicCertificatePage() {
  const params = useParams();
  const certificateCode = params.code as string;

  const {
    data: certificateData,
    isLoading,
    error,
  } = useGetCertificateByCodeQuery(certificateCode, {
    skip: !certificateCode,
  });

  const certificate = certificateData?.data;

  // Helper function to get view URL (without fl_attachment)
  const getViewUrl = (fileUrl: string) => {
    return fileUrl.replace("/fl_attachment", "");
  };

  // Helper function to get download URL (with fl_attachment)
  const getDownloadUrl = (fileUrl: string) => {
    if (fileUrl.includes("/fl_attachment")) {
      return fileUrl;
    }
    return fileUrl.replace("/upload/", "/upload/fl_attachment/");
  };

  const handleViewCertificate = () => {
    if (certificate?.fileUrl) {
      const viewUrl = getViewUrl(certificate.fileUrl);
      window.open(viewUrl, "_blank");
    }
  };

  const handleDownloadCertificate = () => {
    if (certificate?.fileUrl) {
      const downloadUrl = getDownloadUrl(certificate.fileUrl);
      window.open(downloadUrl, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Verifying Certificate...</h2>
          <p className="text-gray-500">Please wait while we validate the certificate</p>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Certificate Not Found</h2>
            <p className="text-gray-600 mb-4">
              The certificate code &quot;{certificateCode}&quot; could not be verified. Please check
              the code and try again.
            </p>
            <Link href="/">
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                Go to Homepage
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusInfo = (fileUrl?: string) => {
    if (fileUrl) {
      return {
        icon: <CheckCircle className="h-5 w-5 text-green-600" />,
        badge: <Badge className="bg-green-500">Verified</Badge>,
        message: "This certificate has been verified and is authentic.",
      };
    } else {
      return {
        icon: <AlertCircle className="h-5 w-5 text-gray-600" />,
        badge: <Badge variant="outline">Unavailable</Badge>,
        message: "Certificate file is not available.",
      };
    }
  };

  const statusInfo = getStatusInfo(certificate?.fileUrl);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Award className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Certificate Verification</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            This page displays the details of a verified course completion certificate. You can
            trust that this certificate is authentic and has been issued by our platform.
          </p>
        </div>

        {/* Certificate Card */}
        <Card className="max-w-4xl mx-auto shadow-xl border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {statusInfo.icon}
                  {statusInfo.badge}
                </div>
                <h2 className="text-2xl font-bold mb-1">Course Completion Certificate</h2>
                <p className="text-blue-100">{statusInfo.message}</p>
              </div>
              <Award className="h-16 w-16 text-blue-200" />
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {/* Certificate Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Certificate Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Certificate Code</p>
                        <p className="font-mono text-sm font-medium">
                          {certificate.certificateCode}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Issue Date</p>
                        <p className="font-medium">{formatDate(certificate.issuedAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Recipient Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Student Name</p>
                        <p className="font-medium text-lg">{certificate.user.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Email Address</p>
                        <p className="font-medium">{certificate.user.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <BookOpen className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Course Title</p>
                        <p className="font-medium text-lg">{certificate.course.title}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Instructor</p>
                        <p className="font-medium">{certificate.course.instructorName}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Certificate Visual */}
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center mb-8 bg-gradient-to-r from-gray-50 to-blue-50">
              <Award className="h-24 w-24 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-gray-800 mb-2">Certificate of Completion</h4>
              <p className="text-gray-600 mb-4">
                This certifies that <strong>{certificate.user.name}</strong> has successfully
                completed the course
              </p>
              <p className="text-lg font-semibold text-blue-600">
                &quot;{certificate.course.title}&quot;
              </p>
              <p className="text-gray-500 mt-4">Issued on {formatDate(certificate.issuedAt)}</p>
            </div>

            {/* Actions */}
            {certificate.fileUrl && (
              <div className="text-center space-y-3">
                <div className="flex gap-3 justify-center">
                  <Button size="lg" className="px-8" onClick={handleViewCertificate}>
                    <Eye className="h-5 w-5 mr-2" />
                    View Certificate
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8"
                    onClick={handleDownloadCertificate}
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download Certificate
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Click "View" to open the certificate in your browser, or "Download" to save it
                </p>
              </div>
            )}

            {/* Verification Note */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800 mb-1">Certificate Authenticity</p>
                  <p className="text-blue-700">
                    This certificate has been verified against our records. The certificate code{" "}
                    <code className="bg-blue-100 px-1 rounded font-mono">
                      {certificate.certificateCode}
                    </code>{" "}
                    is authentic and was issued by our platform.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Certificate verified on {formatDate(new Date().toISOString())}
          </p>
        </div>
      </div>
    </div>
  );
}
