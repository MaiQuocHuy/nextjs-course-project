"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { useRegisterUserMutation } from "@/services/authApi";

type RegistrationFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "STUDENT" | "INSTRUCTOR";
  briefIntroduction?: string;
  files?: File[];
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
    briefIntroduction: z.string().optional(),
    files: z.any().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.role === "INSTRUCTOR") {
        return data.briefIntroduction && data.briefIntroduction.trim().length > 0;
      }
      return true;
    },
    {
      message: "Brief introduction is required for instructors",
      path: ["briefIntroduction"],
    }
  );

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"success" | "failure">("success");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [modalMessage, setModalMessage] = useState("");

  // RTK Query mutation hook
  const [registerUser] = useRegisterUserMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      role: "STUDENT",
    },
  });

  const role = watch("role");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
    setValue("files", files);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setValue("files", newFiles);
  };

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);

    try {
      // Convert role to uppercase to match backend expectations
      const role = data.role.toUpperCase();

      const result = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: role, // "STUDENT" or "INSTRUCTOR"
      }).unwrap();

      // console.log("Registration successful:", result);
      setModalType("success");
      setModalMessage(
        "Your account has been created successfully. You will be redirected to the login page."
      );
      setShowModal(true);
    } catch (error: any) {
      // console.error("Registration failed:", error);
      setModalType("failure");

      // Handle different error types
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    if (modalType === "success") {
      router.push("/login");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center text-lg">
            Join our learning platform today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Enter your full name"
                className={errors.name ? "border-red-500" : " border-gray-900"}
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
                className={errors.email ? "border-red-500" : "border-gray-900"}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="Create a password"
                  className={errors.password ? "border-red-500" : "border-gray-900"}
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
                  className={errors.confirmPassword ? "border-red-500" : "border-gray-900"}
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
                  <RadioGroupItem value="STUDENT" id="student" className="border-gray-900" />
                  <Label htmlFor="student" className="cursor-pointer">
                    Student
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="INSTRUCTOR" id="instructor" className="border-gray-900" />
                  <Label htmlFor="instructor" className="cursor-pointer">
                    Instructor
                  </Label>
                </div>
              </RadioGroup>
              {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
            </div>

            {/* Conditional Fields for Instructor */}
            {role === "INSTRUCTOR" && (
              <div className="space-y-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900">Instructor Information</h3>

                {/* Brief Introduction */}
                <div className="space-y-2">
                  <Label htmlFor="briefIntroduction">Brief Introduction *</Label>
                  <Textarea
                    id="briefIntroduction"
                    {...register("briefIntroduction")}
                    placeholder="Tell us about your teaching experience, expertise, and what you'd like to teach..."
                    className={`min-h-[120px] ${errors.briefIntroduction ? "border-red-500" : ""}`}
                  />
                  {errors.briefIntroduction && (
                    <p className="text-sm text-red-500">{errors.briefIntroduction.message}</p>
                  )}
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="files">Upload CV/Portfolio/Degree/Certificate (if any)</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="files"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PDF, DOC, DOCX, JPG, PNG (MAX. 10MB each)
                          </p>
                        </div>
                        <input
                          id="files"
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Selected Files Display */}
                    {selectedFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Selected files:</p>
                        {selectedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-white border rounded-lg"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{file.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

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
          <DialogFooter>
            <Button onClick={handleModalClose} className="w-full">
              {modalType === "success" ? "Continue to Login" : "Try Again"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
