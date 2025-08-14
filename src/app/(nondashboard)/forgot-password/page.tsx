"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Shield, Lock } from "lucide-react";
import { toast } from "sonner";

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

const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
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
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
      style={{ backgroundColor: "#e5ecff" }}
    >
      <div className="w-full max-w-md space-y-8">
        <div className="bg-white py-8 px-6 shadow-sm rounded-lg border">
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Forgot your password?
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {step === "email" &&
                "Enter your email address and we'll send you an OTP to reset your password."}
              {step === "reset" && `Enter the OTP sent to your email and set your new password.`}
            </p>
          </div>

          <div className="space-y-6">
            {step === "email" ? (
              // Email Input Step
              <Form {...emailForm}>
                <form className="space-y-4">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email address
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter your email"
                            className="h-11 border-gray-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    onClick={handleSendCode}
                    disabled={!isEmailValid || isSendingCode}
                    className="w-full h-11"
                  >
                    {isSendingCode ? "Sending..." : "Send OTP"}
                  </Button>
                </form>
              </Form>
            ) : (
              // Reset Form Step (OTP + Password)
              <Form {...resetForm}>
                <form onSubmit={resetForm.handleSubmit(handlePasswordReset)} className="space-y-4">
                  {/* Display Email (Read-only) */}
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email address
                    </FormLabel>
                    <FormControl>
                      <Input
                        value={userEmail}
                        disabled
                        className="h-11 border-gray-900 bg-gray-50"
                      />
                    </FormControl>
                  </FormItem>

                  {/* OTP Input */}
                  <FormField
                    control={resetForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          OTP Code
                        </FormLabel>
                        <FormControl>
                          <div className="flex justify-center">
                            <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
                              <InputOTPGroup>
                                <InputOTPSlot index={0} className="border-gray-900" />
                                <InputOTPSlot index={1} className="border-gray-900" />
                                <InputOTPSlot index={2} className="border-gray-900" />
                                <InputOTPSlot index={3} className="border-gray-900" />
                                <InputOTPSlot index={4} className="border-gray-900" />
                                <InputOTPSlot index={5} className="border-gray-900" />
                              </InputOTPGroup>
                            </InputOTP>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Resend OTP Button */}
                  <div className="flex justify-center">
                    {countdown > 0 ? (
                      <Button disabled variant="outline" size="sm">
                        Resend OTP in {countdown}s
                      </Button>
                    ) : (
                      <Button
                        tabIndex={-1}
                        type="button"
                        onClick={handleResendCode}
                        disabled={isSendingCode}
                        variant="outline"
                        size="sm"
                      >
                        {isSendingCode ? "Sending..." : "Resend OTP"}
                      </Button>
                    )}
                  </div>

                  {/* New Password */}
                  <FormField
                    control={resetForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          New Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter new password"
                              className="h-11 pr-10 border-gray-900"
                            />
                            <button
                              tabIndex={-1}
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-900" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-900" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Confirm Password */}
                  <FormField
                    control={resetForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type="password"
                              placeholder="Confirm new password"
                              className="h-11 pr-10 border-gray-900"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                        {passwordsMatch && (
                          <p className="text-sm text-green-600 flex items-center gap-1">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Passwords match
                          </p>
                        )}
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={
                      resetForm.formState.isSubmitting || isResettingPassword || !passwordsMatch
                    }
                    className="w-full h-11"
                  >
                    {resetForm.formState.isSubmitting || isResettingPassword
                      ? "Resetting..."
                      : "Reset Password"}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>

        {/* Back to login link */}
        <div className="text-center">
          <button
            onClick={() => router.push("/login")}
            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            ← Back to login
          </button>
        </div>
      </div>

      {/* Success Popup */}
      <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Password Reset Complete!
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Your password has been successfully reset. You will be redirected to the login page
              shortly.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6">
            <Button
              onClick={() => {
                setShowSuccessPopup(false);
                router.push("/login");
              }}
              className="w-full"
            >
              Go to Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
