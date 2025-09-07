"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetCertificateByCodeQuery,
  useGetMyCertificatesQuery,
} from "@/services/common/certificateApi";
import { Certificate } from "@/types/certificate";
import { Download, Eye, Award, Calendar, User, Search } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import CertificateDetailModal from "@/components/common/CertificateDetailModal";
import { DashboardLayout } from "@/components/dashboard-student/DashboardLayout";

export default function CertificatesPage() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debounce search query with 300ms delay
  useEffect(() => {
    if (searchQuery !== debouncedSearchQuery) {
      setIsSearching(true);
    }

    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, debouncedSearchQuery]);

  const {
    data: certificatesData,
    isLoading,
    error,
    refetch,
  } = useGetMyCertificatesQuery(
    {
      page,
      size,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const allCertificates = certificatesData?.data.content || [];
  const pageData = certificatesData?.data.page;

  // Frontend search filtering
  const filteredCertificates = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return allCertificates;
    }

    const query = debouncedSearchQuery.toLowerCase().trim();
    return allCertificates.filter(
      (certificate) =>
        certificate.courseTitle.toLowerCase().includes(query) ||
        certificate.certificateCode.toLowerCase().includes(query)
    );
  }, [allCertificates, debouncedSearchQuery]);

  const getStatusBadge = (status: Certificate["fileStatus"]) => {
    switch (status) {
      case "GENERATED":
        return (
          <Badge variant="default" className="bg-green-500">
            Generated
          </Badge>
        );
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleViewDetails = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsModalOpen(true);
  };

  const [downloadingCertificateCode, setDownloadingCertificateCode] = useState<string | null>(null);

  // Query for certificate details when downloading
  const { data: downloadCertificateData, isLoading: isDownloadLoading } =
    useGetCertificateByCodeQuery(downloadingCertificateCode || "", {
      skip: !downloadingCertificateCode,
    });

  // Effect to handle download when certificate data is loaded
  useEffect(() => {
    if (downloadCertificateData?.data?.fileUrl && downloadingCertificateCode) {
      const fileUrl = downloadCertificateData.data.fileUrl;
      window.open(fileUrl, "_blank");

      // Reset the downloading state
      setDownloadingCertificateCode(null);
    }
  }, [downloadCertificateData, downloadingCertificateCode]);

  const handleDownload = (certificate: Certificate) => {
    setDownloadingCertificateCode(certificate.certificateCode);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (error) {
    console.error("Certificate loading error:", error);
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

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Award className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-red-600 mb-2">
                  Error Loading Certificates
                </h3>
                <p className="text-gray-600 mb-4">
                  {"status" in error ? `Server error: ${error.status}` : "Network error occurred"}
                </p>
                <Button onClick={() => refetch()} variant="outline">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

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

        <Card>
          <CardHeader>
            <CardTitle>
              Certificates ({pageData?.totalElements || 0})
              {debouncedSearchQuery && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  - {filteredCertificates.length} found
                </span>
              )}
            </CardTitle>
            <div className="flex gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by course name or certificate code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
              <Select
                value={`${size}`}
                onValueChange={(value) => {
                  setSize(parseInt(value));
                  setPage(0);
                }}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading certificates...</div>
            ) : allCertificates.length === 0 ? (
              <div className="text-center py-8">
                <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Certificates Yet</h3>
                <p className="text-gray-500">Complete courses to earn certificates</p>
              </div>
            ) : filteredCertificates.length === 0 ? (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No certificates found</h3>
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
                        <TableHead>Certificate Code</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Instructor</TableHead>
                        <TableHead>Issue Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCertificates.map((certificate) => (
                        <TableRow key={certificate.id}>
                          <TableCell className="font-mono text-sm">
                            {certificate.certificateCode}
                          </TableCell>
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
                              {formatDate(certificate.issuedAt)}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(certificate.fileStatus)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetails(certificate)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {certificate.fileStatus === "GENERATED" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDownload(certificate)}
                                  disabled={
                                    downloadingCertificateCode === certificate.certificateCode &&
                                    isDownloadLoading
                                  }
                                >
                                  {downloadingCertificateCode === certificate.certificateCode &&
                                  isDownloadLoading ? (
                                    <div className="animate-spin h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full"></div>
                                  ) : (
                                    <Download className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
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
          </CardContent>
        </Card>

        {/* Certificate Detail Modal */}
        <CertificateDetailModal
          certificate={selectedCertificate}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
}
