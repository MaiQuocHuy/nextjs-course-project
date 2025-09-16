"use client";

import { useGetProfileQuery } from "@/services/common/profileApi";
import {
  useUpdateProfileMutation,
  useUpdateThumbnailMutation,
} from "@/services/common/settingsApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Download,
  Globe,
  FileText,
  File,
  Edit,
  Upload,
  X,
  CheckCircle,
  Pencil,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const router = useRouter();
  const { data: profileData, isLoading, error, refetch } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [updateThumbnail, { isLoading: isUpdatingThumbnail }] =
    useUpdateThumbnailMutation();

  // Basic profile edit states
  const [showEditModal, setShowEditModal] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Applications edit states
  const [showAppEditModal, setShowAppEditModal] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [supportingFile, setSupportingFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [filePreviews, setFilePreviews] = useState<{ [key: string]: string }>(
    {}
  );

  // Mock data for the instructor's applications section
  const mockDocuments = {
    portfolio: "https://github.com/instructor-portfolio",
    certificate:
      "https://res.cloudinary.com/dd4znnno1/raw/upload/v1755857896/instructor-documents/instructor-documents/certificate.pdf",
    cv: "https://res.cloudinary.com/dd4znnno1/raw/upload/v1755857896/instructor-documents/instructor-documents/cv.pdf",
    otherDocuments: [
      "https://res.cloudinary.com/dd4znnno1/raw/upload/v1755857896/instructor-documents/instructor-documents/recommendation.pdf",
      "https://res.cloudinary.com/dd4znnno1/raw/upload/v1755857896/instructor-documents/instructor-documents/sample_teaching.docx",
    ],
  };

  // Open edit modal and set initial values
  const handleEditProfile = () => {
    if (profileData?.data) {
      setName(profileData.data.name || "");
      setBio(profileData.data.bio || "");
      setThumbnailPreview(profileData.data.thumbnailUrl || null);
      setThumbnail(null);
      setShowEditModal(true);
    }
  };

  // Handle profile image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid image file (JPG, PNG, or WebP)");
        return;
      }

      if (file.size > maxSize) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setThumbnail(file);

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle removing the image
  const handleRemoveImage = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle saving the profile changes
  const handleSaveProfile = async () => {
    try {
      if (!name.trim()) {
        toast.error("Name is required");
        return;
      }

      if (thumbnail) {
        // Update with new thumbnail
        await updateThumbnail({
          thumbnail,
          bio,
          currentName: name,
        }).unwrap();
      } else {
        // Update just the name and bio
        await updateProfile({
          name,
          bio,
        }).unwrap();
      }

      toast.success("Profile updated successfully");
      setShowEditModal(false);
      refetch(); // Refresh profile data
    } catch (error) {
      // console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  // Helper functions for applications edit
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const validateFile = (file: File, maxSizeMB = 15) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (file.size > maxSizeBytes) {
      const error = `File size must be less than ${maxSizeMB}MB`;
      toast.error(error);
      return error;
    }

    if (!allowedTypes.includes(file.type)) {
      const error =
        "File type not supported. Please upload PDF, DOCX, JPG, or PNG files.";
      toast.error(error);
      return error;
    }

    return null;
  };

  const generateFilePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        resolve(""); // No preview for non-image files
      }
    });
  };

  const simulateUpload = (fileId: string) => {
    setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const currentProgress = prev[fileId] || 0;
        if (currentProgress >= 100) {
          clearInterval(interval);
          return prev;
        }
        return { ...prev, [fileId]: currentProgress + 10 };
      });
    }, 200);
  };

  // Handle opening application edit modal
  const handleEditApplications = () => {
    setPortfolioUrl(mockDocuments.portfolio || "");
    setCertificateFile(null);
    setCvFile(null);
    setSupportingFile(null);
    setFilePreviews({});
    setUploadProgress({});
    setShowAppEditModal(true);
  };

  // Handle saving application changes (this will be completed by you later)
  const handleSaveApplications = () => {
    toast.info("Application update functionality will be implemented later");
    setShowAppEditModal(false);
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error || !profileData) {
    return (
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="text-red-600 text-lg font-medium mb-2">
            Error loading profile
          </div>
          <div className="text-gray-500 mb-4">Please try again later</div>
        </div>
      </div>
    );
  }

  const { data: user } = profileData;

  const handleGoBack = () => {
    router.push("/instructor");
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={handleGoBack}
        className="flex items-center gap-2 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button onClick={handleEditProfile} className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      {/* Basic Information Section */}
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0">
              <Avatar className="h-24 w-24 border">
                {user.thumbnailUrl ? (
                  <img
                    src={user.thumbnailUrl}
                    alt={user.name}
                    className="aspect-square h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-xl uppercase">
                    {user.name.charAt(0)}
                  </div>
                )}
              </Avatar>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold">{user.name}</h2>
                  <Badge variant="outline" className="capitalize">
                    {user.role || "User"}
                  </Badge>
                </div>
                <p className="text-gray-500">{user.email}</p>
              </div>
              <div>
                <h3 className="text-md font-semibold mb-1">Bio</h3>
                <p className="text-gray-600">{user.bio || "No bio provided"}</p>
              </div>
              {/* <div>
                <Badge variant={user.isActive ? "default" : "destructive"}>
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
              </div> */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Profile Image */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="h-24 w-24 border">
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt="Preview"
                      className="aspect-square h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-xl uppercase">
                      {name ? name.charAt(0) : "U"}
                    </div>
                  )}
                </Avatar>
                <div className="absolute -bottom-2 -right-2 flex gap-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-full bg-primary p-1.5 text-white shadow-sm hover:bg-primary/90"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  {thumbnailPreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="rounded-full bg-destructive p-1.5 text-white shadow-sm hover:bg-destructive/90"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
              />
              <p className="text-xs text-gray-500">
                Recommended: Square JPG, PNG or WebP, 500x500px (Max 5MB)
              </p>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEditModal(false)}
              disabled={isUpdating || isUpdatingThumbnail}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveProfile}
              disabled={!name.trim() || isUpdating || isUpdatingThumbnail}
            >
              {isUpdating || isUpdatingThumbnail ? (
                <>Saving...</>
              ) : (
                <>Save Changes</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Applications Dialog */}
      <Dialog open={showAppEditModal} onOpenChange={setShowAppEditModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Applications Information</DialogTitle>
            <DialogDescription>
              Update your instructor application documents and portfolio.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-8 py-4">
            <div className="space-y-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6">
              {/* Portfolio URL */}
              <div className="space-y-2">
                <Label
                  htmlFor="portfolioUrl"
                  className="text-sm font-semibold text-gray-700"
                >
                  Portfolio URL (Github/LinkedIn) *
                </Label>
                <Input
                  id="portfolioUrl"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://github.com/yourusername or https://linkedin.com/in/yourprofile"
                  className="h-12 text-base"
                />
                <p className="text-xs text-gray-600">
                  Share your GitHub, LinkedIn, or personal portfolio
                </p>
              </div>

              <div className="space-y-6">
                {/* Certificate Upload */}
                {!certificateFile ? (
                  <FileUploadZone
                    id="certificate-upload"
                    label="Upload Certificate"
                    required
                    validateFile={validateFile}
                    onFileSelect={async (file) => {
                      setCertificateFile(file);
                      simulateUpload(`cert-${file.name}`);

                      // Generate preview for images
                      if (file.type.startsWith("image/")) {
                        const preview = await generateFilePreview(file);
                        setFilePreviews((prev) => ({
                          ...prev,
                          [`cert-${file.name}`]: preview,
                        }));
                      }
                    }}
                  />
                ) : (
                  <FileUploadCard
                    file={certificateFile}
                    fileType="cert"
                    preview={filePreviews[`cert-${certificateFile.name}`]}
                    uploadProgress={uploadProgress}
                    formatFileSize={formatFileSize}
                    onRemove={() => {
                      setCertificateFile(null);
                      setFilePreviews((prev) => {
                        const newPreviews = { ...prev };
                        delete newPreviews[`cert-${certificateFile.name}`];
                        return newPreviews;
                      });
                    }}
                  />
                )}

                {/* CV Upload */}
                {!cvFile ? (
                  <FileUploadZone
                    id="cv-upload"
                    label="Upload CV/Resume"
                    required
                    validateFile={validateFile}
                    onFileSelect={async (file) => {
                      setCvFile(file);
                      simulateUpload(`cv-${file.name}`);

                      // Generate preview for images
                      if (file.type.startsWith("image/")) {
                        const preview = await generateFilePreview(file);
                        setFilePreviews((prev) => ({
                          ...prev,
                          [`cv-${file.name}`]: preview,
                        }));
                      }
                    }}
                  />
                ) : (
                  <FileUploadCard
                    file={cvFile}
                    fileType="cv"
                    preview={filePreviews[`cv-${cvFile.name}`]}
                    uploadProgress={uploadProgress}
                    formatFileSize={formatFileSize}
                    onRemove={() => {
                      setCvFile(null);
                      setFilePreviews((prev) => {
                        const newPreviews = { ...prev };
                        delete newPreviews[`cv-${cvFile.name}`];
                        return newPreviews;
                      });
                    }}
                  />
                )}

                {/* Supporting Documents Upload (Optional) */}
                {!supportingFile ? (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">
                      Supporting Document{" "}
                      <span className="text-gray-500 text-sm">(Optional)</span>
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all duration-200 cursor-pointer group">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const error = validateFile(file);
                            if (!error) {
                              setSupportingFile(file);
                              simulateUpload(`support-${file.name}`);

                              // Generate preview for images
                              if (file.type.startsWith("image/")) {
                                const preview = await generateFilePreview(file);
                                setFilePreviews((prev) => ({
                                  ...prev,
                                  [`support-${file.name}`]: preview,
                                }));
                              }
                            }
                          }
                        }}
                        className="hidden"
                        id="supporting-upload"
                      />
                      <label
                        htmlFor="supporting-upload"
                        className="cursor-pointer block text-center"
                      >
                        <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                          <Upload className="w-6 h-6 text-gray-400 group-hover:text-indigo-500" />
                        </div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Upload Supporting Document
                        </p>
                        <p className="text-xs text-gray-500">
                          Degrees, certifications, portfolio (Max 15MB)
                        </p>
                      </label>
                    </div>
                  </div>
                ) : (
                  <FileUploadCard
                    file={supportingFile}
                    fileType="support"
                    preview={filePreviews[`support-${supportingFile.name}`]}
                    uploadProgress={uploadProgress}
                    formatFileSize={formatFileSize}
                    onRemove={() => {
                      setSupportingFile(null);
                      setFilePreviews((prev) => {
                        const newPreviews = { ...prev };
                        delete newPreviews[`support-${supportingFile.name}`];
                        return newPreviews;
                      });
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAppEditModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveApplications}
              disabled={!portfolioUrl.trim() || !certificateFile || !cvFile}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Applications Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Applications</CardTitle>
            <Button variant="outline" onClick={handleEditApplications}>
              <Edit className="h-4 w-4 mr-2" />
              Update Applications
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Portfolio
            </h3>
            <FileDisplay file={mockDocuments.portfolio} label="Portfolio" />
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Certificate
            </h3>
            <FileDisplay file={mockDocuments.certificate} label="Certificate" />
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              CV
            </h3>
            <FileDisplay file={mockDocuments.cv} label="CV" />
          </div>

          {mockDocuments.otherDocuments &&
            mockDocuments.otherDocuments.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <File className="h-5 w-5" />
                  Other Documents
                </h3>
                <div className="space-y-3">
                  {mockDocuments.otherDocuments.map((doc, index) => (
                    <FileDisplay
                      key={index}
                      file={doc}
                      label={`Document ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
};

// Skeleton for loading state
const ProfileSkeleton = () => {
  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => {}}
        className="flex items-center gap-2 mb-6 opacity-50"
        disabled
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>

      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-10 w-48 animate-pulse" />
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-3">
          <Skeleton className="h-7 w-40 animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Skeleton className="h-24 w-24 rounded-full animate-pulse" />
            <div className="flex-1 space-y-4 w-full">
              <div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-48 animate-pulse" />
                  <Skeleton className="h-6 w-24 animate-pulse" />
                </div>
                <Skeleton className="h-5 w-64 mt-2 animate-pulse" />
              </div>
              <div>
                <Skeleton className="h-6 w-32 mb-1 animate-pulse" />
                <Skeleton className="h-20 w-full animate-pulse" />
              </div>
              <Skeleton className="h-6 w-16 animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3 flex justify-between">
          <Skeleton className="h-7 w-40 animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="space-y-3 p-3 border border-gray-100 rounded-md"
            >
              <Skeleton className="h-6 w-32 animate-pulse" />
              <div className="flex gap-4">
                <Skeleton className="h-16 w-16 animate-pulse" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-full mb-2 animate-pulse" />
                  <Skeleton className="h-4 w-2/3 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

// FileUploadCard component for the applications edit modal
const FileUploadCard = ({
  file,
  onRemove,
  fileType,
  preview,
  uploadProgress,
  formatFileSize,
}: {
  file: File;
  onRemove: () => void;
  fileType: string;
  preview?: string;
  uploadProgress: { [key: string]: number };
  formatFileSize: (bytes: number) => string;
}) => {
  const isImage = file.type.startsWith("image/");
  const uploadKey = `${fileType}-${file.name}`;
  const progress = uploadProgress[uploadKey];
  const isUploading = progress !== undefined && progress < 100;

  return (
    <div className="bg-white border-2 border-green-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-start gap-4">
        {/* Thumbnail or File Icon */}
        <div className="flex-shrink-0">
          {isImage && preview ? (
            <div className="relative">
              <img
                src={preview || "/placeholder.svg"}
                alt="File preview"
                className="w-16 h-16 object-cover rounded-lg border"
              />
              <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                <CheckCircle className="w-3 h-3" />
              </div>
            </div>
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border">
              <FileText className="w-8 h-8 text-gray-400" />
              <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                <CheckCircle className="w-3 h-3" />
              </div>
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatFileSize(file.size)}
              </p>
              {isUploading && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
              {!isUploading && (
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">
                    Ready to upload
                  </span>
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// FileUploadZone component for the applications edit modal
const FileUploadZone = ({
  id,
  label,
  required = false,
  onFileSelect,
  validateFile,
}: {
  id: string;
  label: string;
  required?: boolean;
  onFileSelect: (file: File) => void;
  validateFile: (file: File, maxSizeMB?: number) => string | null;
}) => (
  <div className="space-y-3">
    <Label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    <div className="border-2 border-dashed border-indigo-300 rounded-xl p-6 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-200 cursor-pointer group">
      <input
        type="file"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const error = validateFile(file);
            if (!error) {
              onFileSelect(file);
            }
          }
        }}
        className="hidden"
        id={id}
      />
      <label htmlFor={id} className="cursor-pointer block text-center">
        <div className="w-12 h-12 mx-auto mb-3 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
          <Upload className="w-6 h-6 text-indigo-600" />
        </div>
        <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
        <p className="text-xs text-gray-500">PDF, DOCX, JPG, PNG (Max 15MB)</p>
      </label>
    </div>
  </div>
);

// FileDisplay component for showing documents
// Simplified version adapted from the original
const FileDisplay = ({
  file,
  label,
}: {
  file: string | { name?: string; type?: string; url?: string };
  label: string;
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);

  // Get file information
  const getFileInfo = () => {
    if (typeof file === "string") {
      const url = file;
      let fileName = "Unknown File";
      let fileExtension = "";

      fileName = url.split("/").pop()?.split("?")[0] || "Unknown File";
      fileExtension = fileName.split(".").pop()?.toLowerCase() || "";

      // Check for external sites
      if (url.includes("github.com")) {
        return {
          name: "GitHub Repository/Portfolio",
          type: "external-github",
          url: url,
        };
      }

      // File type detection by extension
      const imageExts = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"];
      const documentExts = ["pdf", "doc", "docx", "txt", "rtf"];

      let fileType = "document";

      if (imageExts.includes(fileExtension)) {
        fileType = "image";
      } else if (fileExtension === "pdf") {
        fileType = "pdf";
      } else if (documentExts.includes(fileExtension)) {
        fileType = "document";
      }

      return {
        name: fileName,
        type: fileType,
        url: url,
      };
    }

    return {
      name: file.name || "Unknown File",
      type: file.type || "document",
      url: file.url || "",
    };
  };

  const fileInfo = getFileInfo();
  const isImage = fileInfo.type === "image";
  const isPDF = fileInfo.type === "pdf";
  const isExternal = fileInfo.type.startsWith("external-");

  // Check if file can be previewed
  const canPreview = isImage || isPDF;

  // Open file in new tab
  const handleFileOpen = () => {
    if (fileInfo.url) {
      window.open(fileInfo.url, "_blank");
    }
  };

  // Open preview dialog
  const handlePreviewOpen = () => {
    setPreviewOpen(true);
  };

  // Special handling for external links
  if (isExternal) {
    return (
      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Globe className="h-5 w-5 text-blue-600" />
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{fileInfo.name}</div>
            <div className="text-xs text-gray-500 truncate">{fileInfo.url}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-3">
          <Button
            onClick={handleFileOpen}
            variant="outline"
            size="sm"
            className="hidden sm:flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {isImage ? (
          <img
            src={fileInfo.url}
            alt={fileInfo.name}
            className="w-10 h-10 object-cover rounded"
          />
        ) : (
          <FileText className="h-10 w-10 p-2 bg-blue-100 text-blue-600 rounded" />
        )}
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{fileInfo.name}</div>
          <div className="text-xs text-gray-500 truncate">{label}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-3">
        <Button
          onClick={canPreview ? handlePreviewOpen : handleFileOpen}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          {canPreview ? "Preview" : "Open"}
        </Button>

        <Button
          onClick={handleFileOpen}
          variant="outline"
          size="sm"
          className="hidden sm:flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-[95vw] w-full sm:max-w-3xl md:max-w-5xl max-h-[95vh] overflow-auto p-2 sm:p-4">
          <div className="flex justify-center h-full">
            {isImage ? (
              <img
                src={fileInfo.url}
                alt={fileInfo.name}
                className="max-h-full object-contain"
              />
            ) : isPDF ? (
              <iframe
                src={`${fileInfo.url}#view=FitH`}
                title={fileInfo.name}
                className="w-full h-[80vh]"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-10">
                <FileText className="h-16 w-16 text-blue-600 mb-4" />
                <p className="text-lg font-medium mb-2">
                  Preview not available
                </p>
                <Button onClick={handleFileOpen} className="mt-2">
                  Open File
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
