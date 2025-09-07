"use client";

import React, { useState } from "react";
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
import { useGetCoursesQuery } from "@/services/instructor/courses/courses-api";
import { useGetCertificatesByCourseQuery } from "@/services/common/certificateApi";
import { Course } from "@/types/instructor/courses";
import { Award, Calendar, User, Eye, BookOpen, Users } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import CertificateDetailModal from "@/components/common/CertificateDetailModal";
import { Certificate } from "@/types/certificate";

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

  const handleViewCourseGraduates = (courseId: string) => {
    setSelectedCourseId(courseId);
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Courses List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Your Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingCourses ? (
                <div className="text-center py-4">Loading courses...</div>
              ) : courses.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Courses</h3>
                  <p className="text-gray-500">You haven't created any courses yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {courses.map((course: Course) => (
                    <div
                      key={course.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedCourseId === course.id ? "border-blue-500 bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm line-clamp-2">{course.title}</h4>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {course.totalStudents} enrolled
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewCourseGraduates(course.id)}
                        className="w-full text-xs"
                      >
                        <Award className="h-3 w-3 mr-1" />
                        View Graduates
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Certificates List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Course Certificates
                {selectedCourseId && certificates.length > 0 && (
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    ({certificates.length} certificates)
                  </span>
                )}
              </CardTitle>
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
                  <h3 className="text-lg font-medium text-red-600 mb-2">
                    Error Loading Certificates
                  </h3>
                  <p className="text-gray-600">Failed to load certificates for this course.</p>
                </div>
              ) : certificates.length === 0 ? (
                <div className="text-center py-12">
                  <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Certificates Yet</h3>
                  <p className="text-gray-500">
                    No students have completed this course and received certificates yet.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Certificate Code</TableHead>
                        <TableHead>Student</TableHead>

                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {certificates.map((certificate: CertificateListItem) => (
                        <TableRow key={certificate.id}>
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
        </div>
      </div>

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
