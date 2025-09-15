"use client";

import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Eye, Calendar, User } from "lucide-react";
import type { Certificate } from "@/types/certificate";

interface Props {
  certificate: Certificate;
  index: number;
  page: number;
  size: number;
  getStatusBadge: (s: Certificate["fileStatus"]) => React.ReactNode;
  handleViewDetails: (c: Certificate) => void;
  handleDownload: (c: Certificate) => void;
  downloadingCertificateCode: string | null;
  isDownloadLoading: boolean;
}

export default function CertificateRow({ certificate, index, page, size, getStatusBadge, handleViewDetails, handleDownload, downloadingCertificateCode, isDownloadLoading }: Props) {
  return (
    <TableRow>
      <TableCell className="text-gray-500 font-medium">{page * size + index + 1}</TableCell>
      <TableCell>
        <div>
          <div className="font-medium">{certificate.courseTitle}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <User className="h-4 w-4 text-gray-400" />
          {certificate.instructorName}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4 text-gray-400" />
          {certificate.issuedAt ? new Date(certificate.issuedAt).toLocaleDateString() : "-"}
        </div>
      </TableCell>
      <TableCell>{getStatusBadge(certificate.fileStatus)}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleViewDetails(certificate)}>
            <Eye className="h-4 w-4" />
          </Button>
          {certificate.fileStatus === "GENERATED" && (
            <Button variant="outline" size="sm" onClick={() => handleDownload(certificate)} disabled={downloadingCertificateCode === certificate.certificateCode && isDownloadLoading}>
              {downloadingCertificateCode === certificate.certificateCode && isDownloadLoading ? (
                <div className="animate-spin h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full"></div>
              ) : (
                <Download className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
