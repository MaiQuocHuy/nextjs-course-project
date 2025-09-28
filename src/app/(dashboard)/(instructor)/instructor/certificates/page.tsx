"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { useGetCoursesQuery } from "@/services/instructor/courses/courses-api";
import { useGetCertificatesByCourseQuery } from "@/services/common/certificateApi";
import { Course } from "@/types/instructor/courses/courses";
import { Award, User, Eye, BookOpen, Users, Search } from "lucide-react";
import CertificateDetailModal from "@/components/common/CertificateDetailModal";
import { Certificate } from "@/types/certificate";
import { Input } from "@/components/ui/input";

interface CertificateListItem {
  id: string;
  certificateCode: string;
  issuedAt: string;
  userName: string;
  userEmail: string;
  courseTitle: string;
  instructorName: string;
  fileStatus: "GENERATED" | "PENDING";
}

export default function InstructorCertificatesPage() {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [certificateSearchQuery, setCertificateSearchQuery] = useState("");

  // Helper function to convert instructor certificate to common certificate format
  const convertToCertificate = (instructorCert: CertificateListItem): Certificate => ({
    id: instructorCert.id,
    certificateCode: instructorCert.certificateCode,
    issuedAt: instructorCert.issuedAt,
    userName: instructorCert.userName,
    userEmail: instructorCert.userEmail,
    courseTitle: instructorCert.courseTitle,
    instructorName: instructorCert.instructorName,
    fileStatus: instructorCert.fileStatus,
  });

  // Fetch instructor's courses
  const {
    data: coursesData,
    isLoading: isLoadingCourses,
    error: coursesError,
  } = useGetCoursesQuery({});

  // Fetch certificates for selected course
  const {
    data: certificatesData,
    isLoading: isLoadingCertificates,
    error: certificatesError,
  } = useGetCertificatesByCourseQuery(
    { courseId: selectedCourseId!, page: 0, size: 50 },
    { skip: !selectedCourseId }
  );

  const courses = coursesData?.content || [];
  const certificates = certificatesData?.content || [];

  // Convert courses to combobox options
  const courseOptions: ComboboxOption[] = courses.map((course: Course) => ({
    value: course.id,
    label: course.title,
    subtitle: ``,
  }));

  // Auto-select the first course when courses are loaded
  useEffect(() => {
    if (courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);

  // Filter certificates based on search query
  const filteredCertificates = certificates.filter(
    (certificate: CertificateListItem) =>
      certificate.certificateCode.toLowerCase().includes(certificateSearchQuery.toLowerCase()) ||
      certificate.userName.toLowerCase().includes(certificateSearchQuery.toLowerCase())
  );

  const handleViewCertificateDetail = (certificate: CertificateListItem) => {
    setSelectedCertificate(convertToCertificate(certificate));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCertificate(null);
  };

  const getStatusBadge = (status: "GENERATED" | "PENDING") => {
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

  if (coursesError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold">Certificates</h1>
          </div>
          <p className="text-gray-600">Manage certificates for your course graduates</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Award className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Courses</h3>
              <p className="text-gray-600">Failed to load your courses. Please try again later.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Award className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold">Certificates</h1>
        </div>
        <p className="text-gray-600">Manage certificates for your course graduates</p>
      </div>

      {/* Course Selection */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Select Course
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Choose a course to view its certificates
            </p>
          </CardHeader>
          <CardContent>
            <Combobox
              options={courseOptions}
              value={selectedCourseId || ""}
              onValueChange={setSelectedCourseId}
              placeholder="Select a course..."
              searchPlaceholder="Search courses..."
              emptyText="No courses found"
              isLoading={isLoadingCourses}
              className="w-full"
            />
          </CardContent>
        </Card>
      </div>

      {/* Certificates List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Course Certificates
            {selectedCourseId && filteredCertificates.length > 0 && (
              <span className="text-sm font-normal text-gray-600 ml-2">
                ({filteredCertificates.length} certificates)
              </span>
            )}
          </CardTitle>
          {/* Certificate Search Bar - only show when course is selected */}
          {selectedCourseId && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by certificate code or student name..."
                value={certificateSearchQuery}
                onChange={(e) => setCertificateSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          )}
        </CardHeader>
        <CardContent>
          {!selectedCourseId ? (
            <div className="text-center py-12">
              <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Select a Course</h3>
              <p className="text-gray-500">
                Choose a course from the left to view its certificates
              </p>
            </div>
          ) : isLoadingCertificates ? (
            <div className="text-center py-8">Loading certificates...</div>
          ) : certificatesError ? (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Certificates</h3>
              <p className="text-gray-600">Failed to load certificates for this course.</p>
            </div>
          ) : filteredCertificates.length === 0 ? (
            <div className="text-center py-12">
              <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {certificateSearchQuery ? "No certificates found" : "No Certificates Yet"}
              </h3>
              <p className="text-gray-500">
                {certificateSearchQuery
                  ? "Try adjusting your search terms"
                  : "No students have completed this course and received certificates yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">#</TableHead>
                    <TableHead>Certificate Code</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCertificates.map((certificate: CertificateListItem, index: number) => (
                    <TableRow key={certificate.id}>
                      <TableCell className="text-gray-500 font-medium">{index + 1}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {certificate.certificateCode}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4 text-gray-400" />
                          {certificate.userName}
                        </div>
                      </TableCell>

                      <TableCell>{getStatusBadge(certificate.fileStatus)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewCertificateDetail(certificate)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Certificate Detail Modal */}
      <CertificateDetailModal
        certificate={selectedCertificate}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isInstructorView={true}
      />
    </div>
  );
}
