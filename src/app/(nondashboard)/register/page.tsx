"use client";

import type React from "react";

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
import { Loader2, Upload, X, CheckCircle, XCircle } from "lucide-react";
import { useRegisterInstructorMutation, useRegisterStudentMutation } from "@/services/authApi";

type RegistrationFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "STUDENT" | "INSTRUCTOR";
  portfolioUrl?: string;
  certificateFiles?: File[];
  cvFile?: File[];
  supportingFiles?: File[];
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
  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [supportingFiles, setSupportingFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [currentStep, setCurrentStep] = useState(1);
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

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);

    const commonSuccess = () => {
      setModalType("success");
      setModalMessage(
        "Your account has been created successfully. You will be redirected to the login page."
      );
      setShowModal(true);
      setTimeout(() => {
        router.replace("/login");
      }, 500);
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
        await registerInstructor({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
          portfolioUrl: data.portfolioUrl ?? "",
          certificateFiles: certificateFiles,
          cvFile: cvFile ? [cvFile] : [],
          supportingFiles: supportingFiles.length > 0 ? supportingFiles : undefined,
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
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSizeMB}MB`;
    }

    if (!allowedTypes.includes(file.type)) {
      return "File type not supported. Please upload PDF, DOCX, JPG, or PNG files.";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl mx-auto">
        <CardHeader className="space-y-1 px-4 sm:px-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center">
            Create Account
          </CardTitle>
          <CardDescription className="text-center text-base sm:text-lg">
            Join our learning platform today
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Step Indicator - Always reserve space to prevent layout shift */}
            <div className="mb-8">
              {/* Mobile Step Indicator */}
              <div className="block sm:hidden">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-sm font-medium ${
                      role === "INSTRUCTOR" ? "text-gray-600" : "text-transparent"
                    }`}
                  >
                    Step {currentStep} of {maxSteps}
                  </span>
                  <span
                    className={`text-sm ${
                      role === "INSTRUCTOR" ? "text-gray-500" : "text-transparent"
                    }`}
                  >
                    {currentStep === 1 ? "Basic Info" : "Instructor Info"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      role === "INSTRUCTOR" ? "bg-blue-600" : "bg-transparent"
                    }`}
                    style={{
                      width: role === "INSTRUCTOR" ? `${(currentStep / maxSteps) * 100}%` : "0%",
                    }}
                  ></div>
                </div>
              </div>

              {/* Desktop Step Indicator */}
              <div className="hidden sm:flex items-center justify-center space-x-4">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                      role === "INSTRUCTOR" && currentStep >= 1
                        ? "bg-blue-600 text-white shadow-lg"
                        : role === "INSTRUCTOR"
                        ? "bg-gray-200 text-gray-600"
                        : "bg-transparent text-transparent"
                    }`}
                  >
                    {role === "INSTRUCTOR" ? (currentStep > 1 ? "✓" : "1") : "1"}
                  </div>
                  <span
                    className={`ml-3 text-sm font-medium ${
                      role === "INSTRUCTOR" ? "text-gray-700" : "text-transparent"
                    }`}
                  >
                    Basic Information
                  </span>
                </div>
                <div
                  className={`w-20 h-1 rounded-full transition-all duration-300 ${
                    role === "INSTRUCTOR" && currentStep >= 2 ? "bg-blue-600" : "bg-gray-200"
                  }`}
                  style={{ opacity: role === "INSTRUCTOR" ? 1 : 0 }}
                ></div>
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                      role === "INSTRUCTOR" && currentStep >= 2
                        ? "bg-blue-600 text-white shadow-lg"
                        : role === "INSTRUCTOR"
                        ? "bg-gray-200 text-gray-600"
                        : "bg-transparent text-transparent"
                    }`}
                  >
                    {role === "INSTRUCTOR" ? "2" : "2"}
                  </div>
                  <span
                    className={`ml-3 text-sm font-medium ${
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
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Enter your full name"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="Enter your email address"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>

                {/* Password Fields */}
                <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      {...register("password")}
                      placeholder="Create a password"
                      className={errors.password ? "border-red-500" : ""}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...register("confirmPassword")}
                      placeholder="Confirm your password"
                      className={errors.confirmPassword ? "border-red-500" : ""}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                {/* User Type Radio Group */}
                <div className="space-y-3">
                  <Label>I am a *</Label>
                  <RadioGroup
                    value={role}
                    onValueChange={(value) => setValue("role", value as "STUDENT" | "INSTRUCTOR")}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="STUDENT" id="student" />
                      <Label htmlFor="student" className="cursor-pointer">
                        Student
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="INSTRUCTOR" id="instructor" />
                      <Label htmlFor="instructor" className="cursor-pointer">
                        Instructor
                      </Label>
                    </div>
                  </RadioGroup>
                  {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
                </div>
              </>
            )}

            {role === "INSTRUCTOR" && currentStep === 2 && (
              <div className="space-y-6 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-semibold text-blue-900 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    Instructor Information
                  </h3>
                  <span className="text-xs sm:text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    Step 2 of 2
                  </span>
                </div>

                {/* Portfolio URL */}
                <div className="space-y-2">
                  <Label htmlFor="portfolioUrl">Portfolio URL (Github/LinkedIn) *</Label>
                  <Input
                    id="portfolioUrl"
                    {...register("portfolioUrl")}
                    placeholder="Github or LinkedIn"
                    className={errors.portfolioUrl ? "border-red-500" : ""}
                  />
                  {errors.portfolioUrl && (
                    <p className="text-sm text-red-500">{errors.portfolioUrl.message}</p>
                  )}
                  <p className="text-xs text-gray-500">GitHub, LinkedIn, or personal portfolio</p>
                </div>

                {/* Certificate Upload */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Certificate(s) *</Label>
                    {certificateFiles.length > 0 && (
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        {certificateFiles.length} file{certificateFiles.length > 1 ? "s" : ""}{" "}
                        uploaded
                      </span>
                    )}
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const validFiles: File[] = [];

                        files.forEach((file) => {
                          const error = validateFile(file);
                          if (!error) {
                            validFiles.push(file);
                            simulateUpload(`cert-${file.name}`);
                          }
                        });

                        setCertificateFiles((prev) => [...prev, ...validFiles]);
                        setValue("certificateFiles", [...certificateFiles, ...validFiles]);
                      }}
                      className="hidden"
                      id="certificate-upload"
                    />
                    <label
                      htmlFor="certificate-upload"
                      className="cursor-pointer block text-center"
                    >
                      <Upload className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 font-medium">Upload Certificate(s)</p>
                      <p className="text-xs text-gray-400 mt-1">
                        PDF, DOCX, JPG, PNG (Max 15MB each)
                      </p>
                    </label>
                  </div>

                  {certificateFiles.length > 0 && (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {certificateFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                            {uploadProgress[`cert-${file.name}`] !== undefined &&
                              uploadProgress[`cert-${file.name}`] < 100 && (
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                  <div
                                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress[`cert-${file.name}`]}%` }}
                                  ></div>
                                </div>
                              )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newFiles = certificateFiles.filter((_, i) => i !== index);
                              setCertificateFiles(newFiles);
                              setValue("certificateFiles", newFiles);
                            }}
                            className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* CV/Resume Upload */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>CV/Resume *</Label>
                    {cvFile && (
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        Uploaded
                      </span>
                    )}
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const error = validateFile(file);
                          if (!error) {
                            setCvFile(file);
                            setValue("cvFile", [file]);
                            simulateUpload(`cv-${file.name}`);
                          }
                        }
                      }}
                      className="hidden"
                      id="cv-upload"
                    />
                    <label htmlFor="cv-upload" className="cursor-pointer block text-center">
                      <Upload className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 font-medium">Upload CV/Resume</p>
                      <p className="text-xs text-gray-400 mt-1">PDF, DOCX, JPG, PNG (Max 15MB)</p>
                    </label>
                  </div>

                  {cvFile && (
                    <div className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{cvFile.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(cvFile.size)}</p>
                        {uploadProgress[`cv-${cvFile.name}`] !== undefined &&
                          uploadProgress[`cv-${cvFile.name}`] < 100 && (
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress[`cv-${cvFile.name}`]}%` }}
                              ></div>
                            </div>
                          )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCvFile(null);
                          setValue("cvFile", []);
                        }}
                        className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Supporting Documents Upload (Optional) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>
                      Supporting Documents <span className="text-gray-500 text-sm">(Optional)</span>
                    </Label>
                    {supportingFiles.length > 0 && (
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        {supportingFiles.length} file{supportingFiles.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const validFiles: File[] = [];

                        files.forEach((file) => {
                          const error = validateFile(file);
                          if (!error) {
                            validFiles.push(file);
                            simulateUpload(`support-${file.name}`);
                          }
                        });

                        setSupportingFiles((prev) => [...prev, ...validFiles]);
                        setValue("supportingFiles", [...supportingFiles, ...validFiles]);
                      }}
                      className="hidden"
                      id="supporting-upload"
                    />
                    <label htmlFor="supporting-upload" className="cursor-pointer block text-center">
                      <Upload className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 font-medium">
                        Upload Supporting Documents
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Degrees, certifications, portfolios (Max 15MB each)
                      </p>
                    </label>
                  </div>

                  {supportingFiles.length > 0 && (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {supportingFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                            {uploadProgress[`support-${file.name}`] !== undefined &&
                              uploadProgress[`support-${file.name}`] < 100 && (
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                  <div
                                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                    style={{
                                      width: `${uploadProgress[`support-${file.name}`]}%`,
                                    }}
                                  ></div>
                                </div>
                              )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newFiles = supportingFiles.filter((_, i) => i !== index);
                              setSupportingFiles(newFiles);
                              setValue("supportingFiles", newFiles);
                            }}
                            className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              {/* Back Button */}
              {role === "INSTRUCTOR" && currentStep === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="w-full sm:flex-1 h-12 text-base sm:text-lg font-semibold order-2 sm:order-1"
                >
                  ← Back to Basic Info
                </Button>
              )}

              {/* Next/Submit Button */}
              {role === "STUDENT" || (role === "INSTRUCTOR" && currentStep === 2) ? (
                <Button
                  type="submit"
                  className="w-full sm:flex-1 h-12 text-base sm:text-lg font-semibold order-1 sm:order-2"
                  disabled={
                    isSubmitting ||
                    (role === "INSTRUCTOR" &&
                      currentStep === 2 &&
                      (!watch("portfolioUrl") || certificateFiles.length === 0 || !cvFile))
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
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
                  className="w-full sm:flex-1 h-12 text-base sm:text-lg font-semibold"
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

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="font-medium text-blue-600 hover:text-blue-500 underline"
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
