"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Certificate } from "@/types/certificate";
import { useGetCertificateByIdQuery } from "@/services/common/certificateApi";
import {
  Download,
  ExternalLink,
  Award,
  Calendar,
  User,
  Mail,
  BookOpen,
  Copy,
  Check,
  Eye,
} from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { toast } from "sonner";

interface CertificateDetailModalProps {
  certificate: Certificate | null;
  isOpen: boolean;
  onClose: () => void;
  isInstructorView?: boolean; // New prop to differentiate views
}

export default function CertificateDetailModal({
  certificate,
  isOpen,
  onClose,
  isInstructorView = false,
}: CertificateDetailModalProps) {
  const [copied, setCopied] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);

  const {
    data: certificateDetail,
    isLoading,
    error,
  } = useGetCertificateByIdQuery(certificate?.id || "", {
    skip: !certificate?.id || !isOpen,
  });

  const handleCopyCode = async () => {
    if (certificate?.certificateCode) {
      try {
        await navigator.clipboard.writeText(certificate.certificateCode);
        setCopied(true);
        toast.success("Certificate code copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast.error("Failed to copy certificate code");
      }
    }
  };

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
    setShowPreview(true);
  };

  const handleDownload = () => {
    if (certificateDetail?.fileUrl) {
      const downloadUrl = getDownloadUrl(certificateDetail.fileUrl);
      window.open(downloadUrl, "_blank");
      toast.success("Certificate download started");
    } else {
      toast.error("Certificate file not available for download");
    }
  };

  const handleViewPublic = () => {
    if (certificate?.certificateCode) {
      // Open public certificate view in new tab with query parameter
      const publicUrl = `${window.location.origin}/certificates?code=${certificate.certificateCode}`;
      window.open(publicUrl, "_blank");
    }
  };

  const getStatusBadge = (status: Certificate["fileStatus"]) => {
    switch (status) {
      case "GENERATED":
        return (
          <Badge variant="default" className="bg-green-500">
            <Award className="h-3 w-3 mr-1" />
            Generated
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="secondary">
            <Award className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );

      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (!certificate) return null;

  // Certificate Preview Modal Component
  const CertificatePreview = () => {
    if (!certificate?.certificateCode) return null;

    // Get the fileUrl from the certificate detail API response
    const previewUrl = certificateDetail?.fileUrl;

    if (!previewUrl) return null;

    return (
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="w-[95vw] sm:w-[85vw] lg:w-[70vw] !max-w-7xl h-[90vh] sm:h-[95vh] p-0 flex flex-col">
          <DialogHeader className="p-3 sm:p-4 md:p-6 pb-2 flex-shrink-0">
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Award className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                <span className="text-sm md:text-base">Certificate Preview</span>
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6 flex-1 min-h-0 flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg border overflow-hidden">
              <img
                src={getViewUrl(previewUrl)}
                alt="Certificate Preview"
                className="max-w-full max-h-full object-contain"
                onLoad={() =>
                  toast.success("Certificate loaded successfully", {
                    duration: 1000,
                  })
                }
                onError={() => toast.error("Failed to load certificate preview")}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div>
      <CertificatePreview />
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] sm:w-[85vw] lg:w-[70vw] !max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader className="px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6">
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
              <span className="text-sm md:text-base">Certificate Details</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 md:space-y-6 px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
            {/* Action Buttons at the top */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 pt-2 border-b pb-3 md:pb-4">
              {isLoading ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  <span className="text-sm">Loading certificate details...</span>
                </div>
              ) : (
                <>
                  {certificate.fileStatus === "GENERATED" && certificateDetail?.fileUrl && (
                    <Button
                      onClick={handleViewCertificate}
                      className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm"
                      size="sm"
                    >
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>View Certificate</span>
                    </Button>
                  )}

                  {certificate.fileStatus === "GENERATED" && certificateDetail?.fileUrl && (
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm"
                      size="sm"
                    >
                      <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Download</span>
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={handleViewPublic}
                    className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm"
                    size="sm"
                  >
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>View Public</span>
                  </Button>
                </>
              )}
            </div>
            {/* Certificate Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 sm:p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4 gap-3 sm:gap-4">
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {certificate.courseTitle}
                  </h3>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(certificate.fileStatus)}
                  </div>
                </div>
                <Award className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-blue-600 shrink-0" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 shrink-0" />
                  <span className="text-gray-600">Issued:</span>
                  <span className="font-medium">{formatDate(certificate.issuedAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 shrink-0" />
                  <span className="text-gray-600">Instructor:</span>
                  <span className="font-medium truncate">
                    {certificateDetail?.course?.instructorName || certificate.instructorName}
                  </span>
                </div>
              </div>
            </div>

            {/* Certificate Code */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700">
                Certificate Code
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 sm:p-3 bg-gray-50 border rounded-lg">
                <code className="flex-1 font-mono text-xs break-all">
                  {certificate.certificateCode}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyCode}
                  className="w-full sm:w-auto sm:h-8 sm:px-3 self-stretch sm:self-auto text-xs"
                >
                  {copied ? (
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                  <span className="ml-2 sm:hidden">Copy Code</span>
                </Button>
              </div>
            </div>

            {/* Recipient Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700">
                  {isInstructorView ? "Student Name" : "Recipient Name"}
                </label>
                <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 border rounded-lg">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 shrink-0" />
                  <span className="text-xs sm:text-sm truncate">
                    {certificateDetail?.user?.name || certificate.userName}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 border rounded-lg">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 shrink-0" />
                  <span className="text-xs sm:text-sm truncate">
                    {certificateDetail?.user?.email || certificate.userEmail}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700">Course Title</label>
              <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 border rounded-lg">
                <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 shrink-0" />
                <span className="text-xs sm:text-sm">
                  {certificateDetail?.course?.title || certificate.courseTitle}
                </span>
              </div>
            </div>

            {/* Help Text */}
            <div className="text-xs bg-blue-50 p-2 sm:p-3 rounded-lg">
              <p className="text-gray-600">
                <strong>{isInstructorView ? "Note:" : "Tip:"}</strong>{" "}
                {isInstructorView
                  ? "This certificate was issued to a student who successfully completed your course. You can share the certificate code or public link with others for verification."
                  : "You can share your certificate by copying the certificate code and sending it to others, or by sharing the public certificate page link."}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
