"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import {
  Search,
  Award,
  Calendar,
  User,
  GraduationCap,
  Download,
  Eye,
  AlertCircle,
  CheckCircle,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

// Import the API hook and types
import { useLazyGetCertificateByCodeQuery, type TransformedCertificateResponse } from "@/services";

// Use the transformed certificate type
type CertificateData = TransformedCertificateResponse;

function CertificateSearchContent() {
  const searchParams = useSearchParams();
  const [searchCode, setSearchCode] = useState("");
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [getCertificateByCode, { isLoading }] = useLazyGetCertificateByCodeQuery();

  // Handle query parameter on component mount
  useEffect(() => {
    const codeFromQuery = searchParams.get("code");
    if (codeFromQuery) {
      setSearchCode(codeFromQuery);
      // Automatically search when code is provided via query parameter
      handleSearchWithCode(codeFromQuery);
    }
  }, [searchParams]);

  const handleSearchWithCode = async (code: string) => {
    if (!code.trim()) {
      setSearchError("Please enter a certificate code");
      return;
    }

    setSearchError(null);
    setCertificate(null);

    try {
      const result = await getCertificateByCode(code.trim()).unwrap();
      setCertificate(result);
    } catch (error: any) {
      console.error("Search error:", error);
      if (error.status === 404) {
        setSearchError("Certificate not found with this code");
      } else {
        setSearchError("An error occurred while searching. Please try again.");
      }
    }
  };

  // Handle CAPTCHA verification
  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  const handleSearch = async () => {
    // Clear previous results
    setCertificate(null);
    setSearchError(null);

    if (!searchCode.trim()) {
      setSearchError("Please enter a certificate code");
      return;
    }

    // Show CAPTCHA if not already verified
    if (!captchaToken) {
      setShowCaptcha(true);
      setSearchError("Please complete the CAPTCHA verification");
      return;
    }

    // Perform search with CAPTCHA verification
    await handleSearchWithCode(searchCode);

    // Reset CAPTCHA after search
    setCaptchaToken(null);
    setShowCaptcha(false);
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleDownload = () => {
    if (!certificate) return;

    const downloadUrl = certificate.fileUrl || certificate.certificateUrl;
    if (!downloadUrl) {
      console.error("No download URL available");
      return;
    }

    // Transform URL to be absolute if needed
    const url = downloadUrl.startsWith("http")
      ? downloadUrl
      : `${window.location.origin}${downloadUrl}`;

    // Create a temporary link element to trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = `certificate-${certificate.certificateCode}.pdf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = () => {
    if (!certificate) return;

    let viewUrl = certificate.fileUrl || certificate.certificateUrl;
    if (!viewUrl) {
      console.error("No view URL available");
      return;
    }

    // Remove /fl_attachment from the URL for viewing
    viewUrl = viewUrl.replace("/fl_attachment", "");

    // Transform URL to be absolute if needed
    const url = viewUrl.startsWith("http") ? viewUrl : `${window.location.origin}${viewUrl}`;

    // Open in new tab
    window.open(url, "_blank");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: CertificateData["fileStatus"]) => {
    switch (status) {
      case "GENERATED":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Generated
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <AlertCircle className="h-3 w-3 mr-1" />
            Unknown
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Award className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Certificate Lookup</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter the certificate code to verify authenticity and view detailed information about
            course completion certificate
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Certificate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter certificate code (e.g., RC-2025-001-ABCD1234)"
                  value={searchCode}
                  onChange={(e) => {
                    setSearchCode(e.target.value);
                    // Show CAPTCHA when user starts typing and hasn't verified yet
                    if (e.target.value.trim() && !captchaToken) {
                      setShowCaptcha(true);
                    }
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="h-12 text-lg"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isLoading || !captchaToken}
                className="h-12 px-8"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>

            {/* CAPTCHA Section */}
            {showCaptcha && (
              <div className="mt-6 flex flex-col items-center space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4" />
                  Please verify you are human to search for certificates
                </div>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                  onChange={handleCaptchaChange}
                  theme="light"
                  size="normal"
                />
              </div>
            )}

            {searchError && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{searchError}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Certificate Details */}
        {certificate && (
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg ">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Award className="h-6 w-6" />
                Certificate Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10">
              {/* Status */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {certificate.certificateCode}
                  </h2>
                  <p className="text-gray-600">Certificate Code</p>
                </div>
                <div className="text-right">{getStatusBadge(certificate.fileStatus)}</div>
              </div>

              <Separator className="my-8" />

              {/* Certificate Information Grid */}
              <div className="grid md:grid-cols-2 gap-10">
                {/* Student Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Student Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Full Name</label>
                      <p className="text-lg font-medium text-gray-900">{certificate.userName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-900">{certificate.userEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Course Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Course Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Course Name</label>
                      <p className="text-lg font-medium text-gray-900">{certificate.courseTitle}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Instructor</label>
                      <p className="text-gray-900">{certificate.instructorName}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Issue Date */}
              <div className="mt-10">
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <label className="text-sm font-medium text-blue-800">
                      Certificate Issue Date
                    </label>
                  </div>
                  <p className="text-lg font-semibold text-blue-900">
                    {formatDate(certificate.issuedAt)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-10 flex gap-4 justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleView}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  View Certificate
                </Button>
                <Button
                  size="lg"
                  onClick={handleDownload}
                  disabled={certificate.fileStatus !== "GENERATED"}
                  className="flex items-center gap-2"
                  title={
                    certificate.fileStatus === "PENDING"
                      ? "Certificate is being generated"
                      : "Download certificate"
                  }
                >
                  <Download className="h-4 w-4" />
                  {certificate.fileStatus === "PENDING" ? "Processing..." : "Download"}
                </Button>
              </div>

              {certificate.fileStatus === "PENDING" && (
                <Alert className="mt-8">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Certificate is being generated. Please come back in a few minutes to download.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* How to Use Section */}
        {!certificate && (
          <Card className="mt-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">How to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h4 className="font-semibold mb-2">Enter Certificate Code</h4>
                  <p className="text-sm text-gray-600">
                    Enter the certificate code you received after completing the course
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <h4 className="font-semibold mb-2">Verify</h4>
                  <p className="text-sm text-gray-600">
                    The system will verify the authenticity of the certificate
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <h4 className="font-semibold mb-2">View & Download</h4>
                  <p className="text-sm text-gray-600">
                    View detailed information and download the certificate PDF
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function CertificateSearchLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Award className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Certificate Lookup</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Loading certificate search...</p>
        </div>
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function CertificateSearchPage() {
  return (
    <Suspense fallback={<CertificateSearchLoading />}>
      <CertificateSearchContent />
    </Suspense>
  );
}
