"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, FileText, CheckCircle, X, Github, Linkedin, Globe } from "lucide-react";
import { useReSubmitApplicationMutation } from "@/services/common/settingsApi";
import { toast } from "sonner";

type ReSubmitFormData = {
  portfolio: string;
  certificateFile: File;
  cvFile: File;
  otherFile?: File;
};

// Validation schema
const reSubmitSchema = z.object({
  portfolio: z
    .string()
    .min(1, "Portfolio URL is required")
    .url("Please enter a valid URL")
    .refine(
      (url) => {
        const domain = url.toLowerCase();
        return (
          domain.includes("github.com") ||
          domain.includes("linkedin.com") ||
          domain.includes("behance.net") ||
          domain.includes("dribbble.com") ||
          domain.includes("notion.so") ||
          url.startsWith("https://") ||
          url.startsWith("http://")
        );
      },
      {
        message: "Please provide a GitHub, LinkedIn, or demo portfolio URL",
      }
    ),
  certificateFile: z.any().refine((file) => file instanceof File, {
    message: "Certificate file is required",
  }),
  cvFile: z.any().refine((file) => file instanceof File, {
    message: "CV file is required",
  }),
  otherFile: z.any().optional(),
});

interface ReSubmitApplicationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ReSubmitApplicationForm: React.FC<ReSubmitApplicationFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"success" | "failure">("success");
  const [modalMessage, setModalMessage] = useState("");
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [otherFile, setOtherFile] = useState<File | null>(null);
  const [filePreviews, setFilePreviews] = useState<{ [key: string]: string }>({});

  const [reSubmitApplication] = useReSubmitApplicationMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReSubmitFormData>({
    resolver: zodResolver(reSubmitSchema),
  });

  const portfolioUrl = watch("portfolio");

  const getPortfolioIcon = () => {
    if (!portfolioUrl) return <Globe className="w-5 h-5 text-gray-400" />;
    const domain = portfolioUrl.toLowerCase();
    if (domain.includes("github.com")) return <Github className="w-5 h-5 text-gray-700" />;
    if (domain.includes("linkedin.com")) return <Linkedin className="w-5 h-5 text-blue-600" />;
    return <Globe className="w-5 h-5 text-purple-600" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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
      const error = "File type not supported. Please upload PDF, DOCX, JPG, or PNG files.";
      toast.error(error);
      return error;
    }

    return null;
  };

  const generateFilePreview = async (file: File): Promise<string> => {
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

  const handleFileSelect = async (file: File, fileType: "certificate" | "cv" | "other") => {
    const error = validateFile(file);
    if (error) return;

    const preview = await generateFilePreview(file);
    if (preview) {
      setFilePreviews((prev) => ({ ...prev, [fileType]: preview }));
    }

    switch (fileType) {
      case "certificate":
        setCertificateFile(file);
        setValue("certificateFile", file);
        break;
      case "cv":
        setCvFile(file);
        setValue("cvFile", file);
        break;
      case "other":
        setOtherFile(file);
        setValue("otherFile", file);
        break;
    }
  };

  const removeFile = (fileType: "certificate" | "cv" | "other") => {
    switch (fileType) {
      case "certificate":
        setCertificateFile(null);
        setValue("certificateFile", undefined as any);
        break;
      case "cv":
        setCvFile(null);
        setValue("cvFile", undefined as any);
        break;
      case "other":
        setOtherFile(null);
        setValue("otherFile", undefined);
        break;
    }
    setFilePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[fileType];
      return newPreviews;
    });
  };

  const onSubmit = async (data: ReSubmitFormData) => {
    setIsSubmitting(true);

    try {
      await reSubmitApplication({
        portfolio: data.portfolio,
        certificate: data.certificateFile,
        cv: data.cvFile,
        other: data.otherFile,
      }).unwrap();

      setModalType("success");
      setModalMessage("Your application has been resubmitted successfully!");
      setShowModal(true);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      setModalType("failure");
      if (error?.data?.message) {
        setModalMessage(error.data.message);
      } else if (error?.status === 400) {
        setModalMessage("Please check your information and try again.");
      } else {
        setModalMessage(
          "There was an error resubmitting your application. Please try again later."
        );
      }
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const FileUploadCard = ({
    file,
    onRemove,
    fileType,
    preview,
  }: {
    file: File;
    onRemove: () => void;
    fileType: string;
    preview?: string;
  }) => {
    const isImage = file.type.startsWith("image/");

    return (
      <div className="bg-white border-2 border-green-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-start gap-4">
          {/* Thumbnail or File Icon - Consistent size */}
          <div className="flex-shrink-0 relative">
            {isImage && preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="File preview"
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border relative">
                <FileText className="w-10 h-10 text-gray-400" />
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">{formatFileSize(file.size)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">Ready to upload</span>
                </div>
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

  const FileUploadZone = ({
    id,
    label,
    required = false,
    onFileSelect,
  }: {
    id: string;
    label: string;
    required?: boolean;
    onFileSelect: (file: File) => void;
  }) => (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="border-2 border-dashed border-indigo-300 rounded-xl p-4 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-200 cursor-pointer group">
        <input
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onFileSelect(file);
            }
          }}
          className="hidden"
          id={id}
        />
        <label htmlFor={id} className="cursor-pointer block">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors flex-shrink-0">
              <Upload className="w-10 h-10 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0 pt-2">
              <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
              <p className="text-xs text-gray-500">PDF, DOCX, JPG, PNG (Max 15MB)</p>
            </div>
          </div>
        </label>
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Resubmit Instructor Application
        </CardTitle>
        <CardDescription className="text-gray-600">
          Please update your documents and portfolio information to resubmit your application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Portfolio URL */}
          <div className="space-y-2">
            <Label htmlFor="portfolio" className="text-sm font-medium text-gray-700">
              Portfolio URL <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {getPortfolioIcon()}
              </div>
              <Input
                id="portfolio"
                {...register("portfolio")}
                placeholder="https://github.com/yourusername or https://linkedin.com/in/yourprofile"
                className={`pl-12 h-12 text-base ${
                  errors.portfolio
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-indigo-500"
                }`}
              />
            </div>
            {errors.portfolio && (
              <p className="text-sm text-red-600 mt-1">{errors.portfolio.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Provide a link to your GitHub profile, LinkedIn, or online portfolio
            </p>
          </div>

          {/* File Upload Section - Single Column Layout */}
          <div className="space-y-8">
            {/* Certificate File */}
            <div className="space-y-4">
              {certificateFile ? (
                <FileUploadCard
                  file={certificateFile}
                  onRemove={() => removeFile("certificate")}
                  fileType="certificate"
                  preview={filePreviews.certificate}
                />
              ) : (
                <FileUploadZone
                  id="certificate-upload"
                  label="Certificate"
                  required={true}
                  onFileSelect={(file) => handleFileSelect(file, "certificate")}
                />
              )}
              {errors.certificateFile && (
                <p className="text-sm text-red-600">{errors.certificateFile.message}</p>
              )}
            </div>

            {/* CV File */}
            <div className="space-y-4">
              {cvFile ? (
                <FileUploadCard
                  file={cvFile}
                  onRemove={() => removeFile("cv")}
                  fileType="cv"
                  preview={filePreviews.cv}
                />
              ) : (
                <FileUploadZone
                  id="cv-upload"
                  label="CV/Resume"
                  required={true}
                  onFileSelect={(file) => handleFileSelect(file, "cv")}
                />
              )}
              {errors.cvFile && <p className="text-sm text-red-600">{errors.cvFile.message}</p>}
            </div>

            {/* Other File */}
            <div className="space-y-4">
              {otherFile ? (
                <FileUploadCard
                  file={otherFile}
                  onRemove={() => removeFile("other")}
                  fileType="other"
                  preview={filePreviews.other}
                />
              ) : (
                <FileUploadZone
                  id="other-upload"
                  label="Additional Supporting Documents (Optional)"
                  onFileSelect={(file) => handleFileSelect(file, "other")}
                />
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="w-full sm:flex-1 h-12 text-base font-semibold border-2 hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              className="w-full sm:flex-1 h-12 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
              disabled={isSubmitting || !portfolioUrl || !certificateFile || !cvFile}
            >
              {isSubmitting ? "Submitting..." : "Resubmit Application"}
            </Button>
          </div>
        </form>

        {/* Success/Failure Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {modalType === "success" ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    Application Resubmitted!
                  </>
                ) : (
                  <>
                    <X className="w-6 h-6 text-red-500" />
                    Submission Failed
                  </>
                )}
              </DialogTitle>
              <DialogDescription>{modalMessage}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setShowModal(false)} className="w-full">
                {modalType === "success" ? "Close" : "Try Again"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
