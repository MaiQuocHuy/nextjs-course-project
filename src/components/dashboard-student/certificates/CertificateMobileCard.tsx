"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Download, Eye, Calendar, User } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import type { Certificate } from "@/types/certificate";

interface CertificateMobileCardProps {
  certificate: Certificate;
  index: number;
  page: number;
  size: number;
  getStatusBadge: (status: Certificate["fileStatus"]) => React.ReactNode;
  handleViewDetails: (certificate: Certificate) => void;
  handleDownload: (certificate: Certificate) => void;
  downloadingCertificateCode: string | null;
  isDownloadLoading: boolean;
}

export default function CertificateMobileCard({
  certificate,
  index,
  page,
  size,
  getStatusBadge,
  handleViewDetails,
  handleDownload,
  downloadingCertificateCode,
  isDownloadLoading,
}: CertificateMobileCardProps) {
  const certificateNumber = page * size + index + 1;
  const isDownloading =
    downloadingCertificateCode === certificate.certificateCode;

  return (
    <Card className="p-4 space-y-3">
      {/* Header with certificate number and status */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
            #{certificateNumber}
          </span>
          <Award className="h-4 w-4 text-blue-600" />
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(certificate.fileStatus)}
        </div>
      </div>

      {/* Course title */}
      <div className="space-y-1">
        <h3 className="font-medium text-sm leading-tight line-clamp-2">
          {certificate.courseTitle}
        </h3>
        <p className="text-xs text-muted-foreground truncate">
          Code: {certificate.certificateCode}
        </p>
      </div>

      {/* Instructor and date info */}
      <div className="grid grid-cols-1 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <User className="h-3 w-3 text-muted-foreground" />
          <span className="text-muted-foreground">Instructor:</span>
          <span className="font-medium truncate">
            {certificate.instructorName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span className="text-muted-foreground">Issued:</span>
          <span className="font-medium">
            {formatDate(certificate.issuedAt)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleViewDetails(certificate)}
          className="flex-1 h-8 text-xs"
        >
          <Eye className="w-3 h-3 mr-1" />
          View
        </Button>

        {certificate.fileStatus === "GENERATED" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownload(certificate)}
            disabled={isDownloading || isDownloadLoading}
            className="flex-1 h-8 text-xs"
          >
            {isDownloading ? (
              <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full mr-1" />
            ) : (
              <Download className="w-3 h-3 mr-1" />
            )}
            {isDownloading ? "..." : "Download"}
          </Button>
        )}
      </div>
    </Card>
  );
}
