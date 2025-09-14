"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Award, Download, Eye, Calendar, User, Search } from "lucide-react";
import type { Certificate } from "@/types/certificate";
import CertificateRow from "./CertificateRow";

interface Props {
  isLoading: boolean;
  allCertificates: Certificate[];
  filteredCertificates: Certificate[];
  page: number;
  size: number;
  pageData: any;
  getStatusBadge: (s: Certificate["fileStatus"]) => React.ReactNode;
  handleViewDetails: (c: Certificate) => void;
  handleDownload: (c: Certificate) => void;
  downloadingCertificateCode: string | null;
  isDownloadLoading: boolean;
  handlePageChange: (n: number) => void;
  refetch: () => void;
  error: any;
}

export default function CertificatesTable({
  isLoading,
  allCertificates,
  filteredCertificates,
  page,
  size,
  pageData,
  getStatusBadge,
  handleViewDetails,
  handleDownload,
  downloadingCertificateCode,
  isDownloadLoading,
  handlePageChange,
  refetch,
  error,
}: Props) {
  if (error) {
    return (
      <div className="text-center py-8">
        <Award className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-red-600 mb-2">
          Error Loading Certificates
        </h3>
        <p className="text-gray-600 mb-4">
          {"status" in error
            ? `Server error: ${error.status}`
            : "Network error occurred"}
        </p>
        <div className="flex justify-center">
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading ? (
        <div className="text-center py-8">Loading certificates...</div>
      ) : allCertificates.length === 0 ? (
        <div className="text-center py-8">
          <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No Certificates Yet
          </h3>
          <p className="text-gray-500">Complete courses to earn certificates</p>
        </div>
      ) : filteredCertificates.length === 0 ? (
        <div className="text-center py-8">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No certificates found
          </h3>
          <p className="text-gray-500">
            Try searching with a different course name or certificate code
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCertificates.map((certificate, index) => (
                  <CertificateRow
                    key={certificate.id}
                    certificate={certificate}
                    index={index}
                    page={page}
                    size={size}
                    getStatusBadge={getStatusBadge}
                    handleViewDetails={handleViewDetails}
                    handleDownload={handleDownload}
                    downloadingCertificateCode={downloadingCertificateCode}
                    isDownloadLoading={isDownloadLoading}
                  />
                ))}
              </TableBody>
            </Table>
          </div>

          {pageData && pageData.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Showing {page * size + 1} to{" "}
                {Math.min((page + 1) * size, pageData.totalElements)} of{" "}
                {pageData.totalElements} certificates
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={pageData.first}
                >
                  Previous
                </Button>
                <span className="flex items-center px-3 text-sm">
                  Page {page + 1} of {pageData.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={pageData.last}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
