"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Shield, Lock, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForgotPasswordMutation, useForgotPasswordConfirmMutation } from "@/services/authApi";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

// Validation schemas
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetFormSchema = z
  .object({
    otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type EmailForm = z.infer<typeof emailSchema>;
type ResetForm = z.infer<typeof resetFormSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "reset">("email");
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // API mutations
  const [forgotPassword, { isLoading: isSendingCode }] = useForgotPasswordMutation();
  const [forgotPasswordConfirm, { isLoading: isResettingPassword }] =
    useForgotPasswordConfirmMutation();

  // Email form
  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  // Reset form (OTP + Password)
  const resetForm = useForm<ResetForm>({
    resolver: zodResolver(resetFormSchema),
    defaultValues: { otp: "", newPassword: "", confirmPassword: "" },
  });

  const isEmailValid = emailForm.formState.isValid && emailForm.watch("email");
  const passwordsMatch =
    resetForm.watch("newPassword") === resetForm.watch("confirmPassword") &&
    resetForm.watch("newPassword") !== "" &&
    resetForm.watch("confirmPassword") !== "";

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendCode = async () => {
    if (!isEmailValid) return;

    const email = emailForm.getValues("email");
    setUserEmail(email);

    try {
      const response = await forgotPassword({ email }).unwrap();
      setStep("reset");
      setCountdown(60);
      toast.success(`OTP sent to ${response.data.maskedEmail}!`);
    } catch (error: any) {
      console.error("Forgot password error:", error);
      const errorMsg =
        error?.data?.message || error?.message || "Failed to send OTP. Please try again.";

      setStep("email");
      toast.error(errorMsg);
    }
  };

  const handleResendCode = async () => {
    if (!userEmail) return;
    try {
      const response = await forgotPassword({ email: userEmail }).unwrap();
      setCountdown(60);
      toast.success(`OTP resent to ${response.data.maskedEmail}!`);
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      const errorMsg =
        error?.data?.message || error?.message || "Failed to resend OTP. Please try again.";

      setCountdown(60);
      toast.error(errorMsg);
    }
  };

  const handlePasswordReset = async (data: ResetForm) => {
    try {
      await forgotPasswordConfirm({
        email: userEmail,
        otpCode: data.otp,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
        passwordMatching: passwordsMatch,
      }).unwrap();
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
      setTimeout(() => {
        router.replace("/login");
      }, 1000);
      toast.success("Password reset successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="min-h-screen flex">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5  relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/forgot-password.webp"
              alt="Forgot Password Illustration"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 50vw, 60vw"
            />
          </div>
          <div className="absolute inset-0 bg-white/30" />

          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 max-w-sm">
            <div className="backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Secure Password Recovery</h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Don't worry! It happens to the best of us. Follow our secure process to regain
                access to your account.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 xl:w-2/5 flex flex-col items-center justify-center p-6 lg:p-12">
          {/* Form Container */}
          <div className="w-full max-w-lg">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
            </div>

            {/* Form Container */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              {/* Step Indicator */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      step === "email" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    1
                  </div>
                  <div
                    className={`w-12 h-0.5 ${step === "reset" ? "bg-blue-600" : "bg-gray-200"}`}
                  />
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      step === "reset" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    2
                  </div>
                </div>
              </div>

              {/* Form Header */}
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step === "email" ? "Enter Your Email" : "Verify & Reset"}
                </h3>
                <p className="text-sm text-gray-600">
                  {step === "email"
                    ? "We'll send you a secure OTP to reset your password"
                    : "Enter the OTP and create your new password"}
                </p>
              </div>

              {step === "email" ? (
                // Email Input Step
                <Form {...emailForm}>
                  <form className="space-y-6">
                    <FormField
                      control={emailForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <Input
                                {...field}
                                type="email"
                                placeholder="Enter your email address"
                                className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      onClick={handleSendCode}
                      disabled={!isEmailValid || isSendingCode}
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                      {isSendingCode ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending OTP...
                        </div>
                      ) : (
                        "Send Verification Code"
                      )}
                    </Button>
                  </form>
                </Form>
              ) : (
                // Reset Form Step
                <Form {...resetForm}>
                  <form
                    onSubmit={resetForm.handleSubmit(handlePasswordReset)}
                    className="space-y-6"
                  >
                    {/* Email Display */}
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            value={userEmail}
                            disabled
                            className="pl-10 h-12 bg-gray-50 border-gray-200 text-gray-600 rounded-lg"
                          />
                        </div>
                      </FormControl>
                    </FormItem>

                    {/* Password Fields */}
                    <div className="space-y-4">
                      <FormField
                        control={resetForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              New Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                  {...field}
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Create a strong password"
                                  className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                />
                                <button
                                  tabIndex={-1}
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                  ) : (
                                    <Eye className="h-5 w-5" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={resetForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Confirm Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                  {...field}
                                  type="password"
                                  placeholder="Confirm your password"
                                  className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                />
                                {passwordsMatch && (
                                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                            {passwordsMatch && (
                              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                                <CheckCircle className="h-4 w-4" />
                                Passwords match perfectly
                              </p>
                            )}
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* OTP Section - Positioned at Bottom */}
                    <div className="border-t border-gray-100 pt-6 mt-8">
                      <FormField
                        control={resetForm.control}
                        name="otp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700 flex items-center justify-center gap-2 mb-4">
                              <Shield className="h-5 w-5 text-blue-600" />
                              Enter Verification Code
                            </FormLabel>
                            <FormControl>
                              <div className="flex justify-center mb-4">
                                <InputOTP
                                  maxLength={6}
                                  value={field.value}
                                  onChange={field.onChange}
                                  className="gap-3"
                                >
                                  <InputOTPGroup className="gap-3">
                                    <InputOTPSlot
                                      index={0}
                                      className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                                    />
                                    <InputOTPSlot
                                      index={1}
                                      className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                                    />
                                    <InputOTPSlot
                                      index={2}
                                      className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                                    />
                                    <InputOTPSlot
                                      index={3}
                                      className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                                    />
                                    <InputOTPSlot
                                      index={4}
                                      className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                                    />
                                    <InputOTPSlot
                                      index={5}
                                      className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                                    />
                                  </InputOTPGroup>
                                </InputOTP>
                              </div>
                            </FormControl>
                            <FormMessage />

                            {/* Resend Button */}
                            <div className="flex justify-center mt-3">
                              {countdown > 0 ? (
                                <p className="text-sm text-gray-500">
                                  Resend code in{" "}
                                  <span className="font-medium text-blue-600">{countdown}s</span>
                                </p>
                              ) : (
                                <button
                                  type="button"
                                  onClick={handleResendCode}
                                  disabled={isSendingCode}
                                  className="text-sm text-blue-600 hover:text-blue-700 font-medium underline"
                                >
                                  {isSendingCode ? "Sending..." : "Resend verification code"}
                                </button>
                              )}
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={
                        resetForm.formState.isSubmitting || isResettingPassword || !passwordsMatch
                      }
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors mt-6"
                    >
                      {resetForm.formState.isSubmitting || isResettingPassword ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Resetting Password...
                        </div>
                      ) : (
                        "Reset Password"
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </div>

            {/* Back to Login */}
            <div className="text-center mt-6">
              <button
                onClick={() => router.push("/login")}
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
        <DialogContent className="sm:max-w-md text-center border-0 shadow-2xl">
          <DialogHeader>
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
              Password Reset Complete!
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-base leading-relaxed">
              Your password has been successfully updated. You will be redirected to the login page
              shortly.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8">
            <Button
              onClick={() => {
                setShowSuccessPopup(false);
                router.push("/login");
              }}
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
            >
              Continue to Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
