"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetCertificateByCodeQuery,
  useGetMyCertificatesQuery,
} from "@/services/common/certificateApi";
import CertificateDetailModal from "@/components/common/CertificateDetailModal";
import CertificatesHeader from "./CertificatesHeader";
import CertificatesTable from "./CertificatesTable";
import type { Certificate } from "@/types/certificate";
import { getCertificateStatusBadge } from "@/utils/student";

export default function CertificatesClient() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    { page, size },
    { refetchOnMountOrArgChange: true }
  );

  const allCertificates = certificatesData?.data.content || [];
  const pageData = certificatesData?.data.page;

  const filteredCertificates = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return allCertificates;
    const query = debouncedSearchQuery.toLowerCase().trim();
    return allCertificates.filter(
      (certificate) =>
        certificate.courseTitle.toLowerCase().includes(query) ||
        certificate.certificateCode.toLowerCase().includes(query)
    );
  }, [allCertificates, debouncedSearchQuery]);

  const handleViewDetails = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsModalOpen(true);
  };

  const [downloadingCertificateCode, setDownloadingCertificateCode] = useState<
    string | null
  >(null);
  const { data: downloadCertificateData, isLoading: isDownloadLoading } =
    useGetCertificateByCodeQuery(downloadingCertificateCode || "", {
      skip: !downloadingCertificateCode,
    });

  useEffect(() => {
    if (downloadCertificateData?.fileUrl && downloadingCertificateCode) {
      const fileUrl = downloadCertificateData.fileUrl;
      window.open(fileUrl, "_blank");
      setDownloadingCertificateCode(null);
    }
  }, [downloadCertificateData, downloadingCertificateCode]);

  const handleDownload = (certificate: Certificate) =>
    setDownloadingCertificateCode(certificate.certificateCode);
  const handlePageChange = (newPage: number) => setPage(newPage);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg md:text-xl">
              Certificates ({pageData?.totalElements || 0})
              {debouncedSearchQuery && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  - {filteredCertificates.length} found
                </span>
              )}
            </CardTitle>
          </div>
          <div className="w-full sm:w-auto">
            <CertificatesHeader
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isSearching={isSearching}
              size={size}
              setSize={(s: number) => {
                setSize(s);
                setPage(0);
              }}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <CertificatesTable
            isLoading={isLoading}
            allCertificates={allCertificates}
            filteredCertificates={filteredCertificates}
            page={page}
            size={size}
            pageData={pageData}
            getStatusBadge={getCertificateStatusBadge}
            handleViewDetails={handleViewDetails}
            handleDownload={handleDownload}
            downloadingCertificateCode={downloadingCertificateCode}
            isDownloadLoading={isDownloadLoading}
            handlePageChange={handlePageChange}
            refetch={refetch}
            error={error}
          />
        </CardContent>
      </Card>

      <CertificateDetailModal
        certificate={selectedCertificate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
