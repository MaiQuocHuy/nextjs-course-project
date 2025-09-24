"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Upload, X, CheckCircle, XCircle, FileText } from "lucide-react";
import { useRegisterInstructorMutation, useRegisterStudentMutation } from "@/services/authApi";

type RegistrationFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "STUDENT" | "INSTRUCTOR";
  portfolioUrl?: string;
  certificateFile?: File;
  cvFile?: File;
  supportingFile?: File;
};

// Zod schema for form validation
const registrationSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    role: z.enum(["STUDENT", "INSTRUCTOR"]),
    portfolioUrl: z.string().optional(),
    files: z.any().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.role === "INSTRUCTOR") {
        return data.portfolioUrl && data.portfolioUrl.trim().length > 0;
      }
      return true;
    },
    {
      message: "Portfolio URL is required for instructors",
      path: ["portfolioUrl"],
    }
  )
  .refine(
    (data) => {
      if (data.role === "INSTRUCTOR" && data.portfolioUrl) {
        try {
          new URL(data.portfolioUrl);
          return true;
        } catch {
          return false;
        }
      }
      return true;
    },
    {
      message: "Please enter a valid URL",
      path: ["portfolioUrl"],
    }
  );

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"success" | "failure">("success");
  const [modalMessage, setModalMessage] = useState("");
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [supportingFile, setSupportingFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [filePreviews, setFilePreviews] = useState<{ [key: string]: string }>({});
  const maxSteps = 2;

  // RTK Query mutation hook
  const [registerUser] = useRegisterStudentMutation();
  const [registerInstructor] = useRegisterInstructorMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      role: "STUDENT",
    },
  });

  const role = watch("role");

  useEffect(() => {
    if (role === "STUDENT") {
      setCurrentStep(1);
    }
  }, [role]);

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

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);

    const commonSuccess = () => {
      setModalType("success");
      setModalMessage(
        "Your account has been created successfully. You will be redirected to the login page."
      );
      setShowModal(true);

      setTimeout(() => router.replace("/login"), 200);
    };

    const commonFailure = (error: any) => {
      setModalType("failure");
      if (error?.data?.message) {
        setModalMessage(error.data.message);
      } else if (error?.status === 409) {
        setModalMessage("An account with this email already exists.");
      } else if (error?.status === 400) {
        setModalMessage("Please check your information and try again.");
      } else {
        setModalMessage("There was an error creating your account. Please try again later.");
      }
      setShowModal(true);
    };

    try {
      if (data.role === "STUDENT") {
        await registerUser({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        }).unwrap();
      } else {
        if (!certificateFile || !cvFile) {
          throw new Error("Certificate and CV files are required for instructor registration.");
        }
        await registerInstructor({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
          portfolioUrl: data.portfolioUrl ?? "",
          certificateFile: certificateFile,
          cvFile: cvFile,
          supportingFile: supportingFile ?? undefined,
        }).unwrap();
      }

      commonSuccess();
    } catch (error: any) {
      commonFailure(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
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
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
      "application/msword", // DOC
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (file.size > maxSizeBytes) {
      const error = `File size must be less than ${maxSizeMB}MB`;
      alert(error);
      return error;
    }

    if (!allowedTypes.includes(file.type)) {
      const error =
        "File type not supported. Please upload PDF, DOCX, DOC, JPG/JPEG, or PNG files.";
      alert(error);
      return error;
    }

    return null;
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
                <p className="text-sm font-semibold text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">{formatFileSize(file.size)}</p>
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
                    <span className="text-xs text-green-600 font-medium">Upload complete</span>
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
          <p className="text-xs text-gray-500">PDF, DOCX, DOC, JPG/JPEG, PNG (Max 15MB)</p>
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900" />
      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-white/25 rounded-full animate-pulse delay-500" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/20 rounded-full animate-pulse delay-700" />
      </div>

      <Card className="w-full max-w-2xl shadow-2xl mx-auto bg-white/95 backdrop-blur-sm border-0 relative z-10">
        <CardHeader className="space-y-2 px-6 py-8 text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Join Our Learning Platform
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Start your educational journey today
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="mb-8">
              {/* Mobile Step Indicator */}
              <div className="block sm:hidden">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-sm font-semibold ${
                      role === "INSTRUCTOR" ? "text-indigo-600" : "text-transparent"
                    }`}
                  >
                    Step {currentStep} of {maxSteps}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      role === "INSTRUCTOR" ? "text-gray-600" : "text-transparent"
                    }`}
                  >
                    {currentStep === 1 ? "Basic Info" : "Instructor Info"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      role === "INSTRUCTOR"
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                        : "bg-transparent"
                    }`}
                    style={{
                      width: role === "INSTRUCTOR" ? `${(currentStep / maxSteps) * 100}%` : "0%",
                    }}
                  />
                </div>
              </div>

              {/* Desktop Step Indicator */}
              <div className="hidden sm:flex items-center justify-center space-x-8">
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      role === "INSTRUCTOR" && currentStep >= 1
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg scale-110"
                        : role === "INSTRUCTOR"
                        ? "bg-gray-200 text-gray-600"
                        : "bg-transparent text-transparent border-2 border-transparent"
                    }`}
                  >
                    {role === "INSTRUCTOR" ? (currentStep > 1 ? "✓" : "1") : "1"}
                  </div>
                  <span
                    className={`ml-4 text-sm font-semibold ${
                      role === "INSTRUCTOR" ? "text-gray-700" : "text-transparent"
                    }`}
                  >
                    Basic Information
                  </span>
                </div>
                <div
                  className={`w-24 h-1 rounded-full transition-all duration-500 ${
                    role === "INSTRUCTOR" && currentStep >= 2
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                      : "bg-gray-200"
                  }`}
                  style={{ opacity: role === "INSTRUCTOR" ? 1 : 0 }}
                />
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      role === "INSTRUCTOR" && currentStep >= 2
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg scale-110"
                        : role === "INSTRUCTOR"
                        ? "bg-gray-200 text-gray-600"
                        : "bg-transparent text-transparent border-2 border-transparent"
                    }`}
                  >
                    {role === "INSTRUCTOR" ? "2" : "2"}
                  </div>
                  <span
                    className={`ml-4 text-sm font-semibold ${
                      role === "INSTRUCTOR" ? "text-gray-700" : "text-transparent"
                    }`}
                  >
                    Instructor Info
                  </span>
                </div>
              </div>
            </div>

            {(role === "STUDENT" || (role === "INSTRUCTOR" && currentStep === 1)) && (
              <>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Enter your full name"
                      className={`h-12 text-base ${
                        errors.name
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 focus:border-indigo-500"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 font-medium">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="Enter your email address"
                      className={`h-12 text-base ${
                        errors.email
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 focus:border-indigo-500"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 font-medium">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                        Password *
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        {...register("password")}
                        placeholder="Create a password"
                        className={`h-12 text-base ${
                          errors.password
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-indigo-500"
                        }`}
                      />
                      {errors.password && (
                        <p className="text-sm text-red-500 font-medium">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Confirm Password *
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...register("confirmPassword")}
                        placeholder="Confirm your password"
                        className={`h-12 text-base ${
                          errors.confirmPassword
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-indigo-500"
                        }`}
                      />
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-500 font-medium">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-semibold text-gray-700">I am a *</Label>
                    <RadioGroup
                      value={role}
                      onValueChange={(value) => setValue("role", value as "STUDENT" | "INSTRUCTOR")}
                      className="flex flex-col space-y-3"
                    >
                      <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
                        <RadioGroupItem value="STUDENT" id="student" className="text-indigo-600" />
                        <Label
                          htmlFor="student"
                          className="cursor-pointer font-medium text-gray-700 flex-1"
                        >
                          Student - I want to learn new skills
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
                        <RadioGroupItem
                          value="INSTRUCTOR"
                          id="instructor"
                          className="text-indigo-600"
                        />
                        <Label
                          htmlFor="instructor"
                          className="cursor-pointer font-medium text-gray-700 flex-1"
                        >
                          Instructor - I want to share my knowledge
                        </Label>
                      </div>
                    </RadioGroup>
                    {errors.role && (
                      <p className="text-sm text-red-500 font-medium">{errors.role.message}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {role === "INSTRUCTOR" && currentStep === 2 && (
              <div className="space-y-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-indigo-900 flex items-center gap-3">
                    <div className="w-3 h-3 bg-indigo-600 rounded-full" />
                    Instructor Information
                  </h3>
                  <span className="text-sm font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                    Step 2 of 2
                  </span>
                </div>

                {/* Portfolio URL */}
                <div className="space-y-2">
                  <Label htmlFor="portfolioUrl" className="text-sm font-semibold text-gray-700">
                    Portfolio URL (Github/LinkedIn) *
                  </Label>
                  <Input
                    id="portfolioUrl"
                    {...register("portfolioUrl")}
                    placeholder="https://github.com/yourusername or https://linkedin.com/in/yourprofile"
                    className={`h-12 text-base ${
                      errors.portfolioUrl
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-indigo-500"
                    }`}
                  />
                  {errors.portfolioUrl && (
                    <p className="text-sm text-red-500 font-medium">
                      {errors.portfolioUrl.message}
                    </p>
                  )}
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
                      onFileSelect={async (file) => {
                        setCertificateFile(file);
                        setValue("certificateFile", file);
                        simulateUpload(`cert-${file.name}`);

                        // Generate preview for images
                        if (file.type.startsWith("image/")) {
                          const preview = await generateFilePreview(file);
                          setFilePreviews((prev) => ({ ...prev, [`cert-${file.name}`]: preview }));
                        }
                      }}
                    />
                  ) : (
                    <FileUploadCard
                      file={certificateFile}
                      fileType="cert"
                      preview={filePreviews[`cert-${certificateFile.name}`]}
                      onRemove={() => {
                        setCertificateFile(null);
                        setValue("certificateFile", undefined);
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
                      onFileSelect={async (file) => {
                        setCvFile(file);
                        setValue("cvFile", file);
                        simulateUpload(`cv-${file.name}`);

                        // Generate preview for images
                        if (file.type.startsWith("image/")) {
                          const preview = await generateFilePreview(file);
                          setFilePreviews((prev) => ({ ...prev, [`cv-${file.name}`]: preview }));
                        }
                      }}
                    />
                  ) : (
                    <FileUploadCard
                      file={cvFile}
                      fileType="cv"
                      preview={filePreviews[`cv-${cvFile.name}`]}
                      onRemove={() => {
                        setCvFile(null);
                        setValue("cvFile", undefined);
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
                                setValue("supportingFile", file);
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
                            PDF, DOCX, DOC, JPG/JPEG, PNG (Max 15MB)
                          </p>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <FileUploadCard
                      file={supportingFile}
                      fileType="support"
                      preview={filePreviews[`support-${supportingFile.name}`]}
                      onRemove={() => {
                        setSupportingFile(null);
                        setValue("supportingFile", undefined);
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
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              {role === "INSTRUCTOR" && currentStep === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="w-full sm:flex-1 h-12 text-base font-semibold border-2 hover:bg-gray-50 order-2 sm:order-1"
                >
                  ← Back to Basic Info
                </Button>
              )}

              {role === "STUDENT" || (role === "INSTRUCTOR" && currentStep === 2) ? (
                <Button
                  type="submit"
                  className="w-full sm:flex-1 h-12 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg order-1 sm:order-2"
                  disabled={
                    isSubmitting ||
                    (role === "INSTRUCTOR" &&
                      currentStep === 2 &&
                      (!watch("portfolioUrl") || !certificateFile || !cvFile))
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      {role === "INSTRUCTOR" && currentStep === 2 && " ✓"}
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={async () => {
                    const step1Fields = [
                      "name",
                      "email",
                      "password",
                      "confirmPassword",
                      "role",
                    ] as const;

                    const isValid = await trigger(step1Fields);

                    if (isValid) {
                      setCurrentStep(2);
                    }
                  }}
                  className="w-full sm:flex-1 h-12 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
                  disabled={
                    !watch("name")?.trim() ||
                    !watch("email")?.trim() ||
                    !watch("password") ||
                    !watch("confirmPassword") ||
                    !watch("role")
                  }
                >
                  Next: Instructor Info →
                </Button>
              )}
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="font-semibold text-indigo-600 hover:text-indigo-500 underline underline-offset-2"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Success/Failure Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {modalType === "success" ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  Registration Successful!
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-red-500" />
                  Registration Failed
                </>
              )}
            </DialogTitle>
            <DialogDescription>{modalMessage}</DialogDescription>
          </DialogHeader>
          {modalType !== "success" && (
            <DialogFooter>
              <Button onClick={handleModalClose} className="w-full">
                Try Again
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
