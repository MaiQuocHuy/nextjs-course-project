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
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

const passwordSchema = z
  .object({
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
type OTPForm = z.infer<typeof otpSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Email form
  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  // OTP form
  const otpForm = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  // Password form
  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const isEmailValid = emailForm.formState.isValid && emailForm.watch("email");
  const otpValue = otpForm.watch("otp");

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-validate OTP when 6 digits entered
  useEffect(() => {
    if (otpValue && otpValue.length === 6) {
      // Simulate OTP validation - in real app, this would be an API call
      setTimeout(() => {
        setIsModalOpen(true);
      }, 500);
    }
  }, [otpValue]);

  const handleSendCode = () => {
    if (!isEmailValid) return;

    const email = emailForm.getValues("email");
    setUserEmail(email);
    setStep("otp");
    setCountdown(60);

    // Simulate API call
    toast.success("OTP sent to your email!");
  };

  const handleResendCode = () => {
    setCountdown(60);
    toast.success("OTP resent to your email!");
  };

  const handlePasswordReset = (data: PasswordForm) => {
    // Simulate password reset API call
    setTimeout(() => {
      setIsModalOpen(false);
      setShowSuccessPopup(true);

      // Auto close success popup and redirect after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
        router.push("/login");
      }, 3000);
    }, 1000);
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
              {step === "otp" && "We've sent an OTP to your email. Enter it below to continue."}
            </p>
          </div>

          <div className="space-y-6">
            {/* Email Input */}
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
                          disabled={step === "otp" && countdown > 0}
                          className="h-11 border-gray-900"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>

            {/* OTP Section */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                OTP Code
              </Label>

              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <Form {...otpForm}>
                    <FormField
                      control={otpForm.control}
                      name="otp"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex justify-center">
                              <InputOTP
                                maxLength={6}
                                disabled={!isEmailValid || step === "email"}
                                value={field.value}
                                onChange={field.onChange}
                              >
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
                  </Form>
                </div>

                <div className="flex-shrink-0">
                  {step === "email" ? (
                    <Button onClick={handleSendCode} disabled={!isEmailValid} className="h-10 px-6">
                      Send Code
                    </Button>
                  ) : countdown > 0 ? (
                    <Button disabled className="h-10 px-6 min-w-[120px]">
                      Resend ({countdown}s)
                    </Button>
                  ) : (
                    <Button
                      onClick={handleResendCode}
                      variant="outline"
                      className="h-10 px-6 bg-transparent"
                    >
                      Resend Code
                    </Button>
                  )}
                </div>
              </div>

              {step === "otp" && (
                <p className="text-sm text-green-600 flex items-center gap-2 justify-center">
                  <Mail className="h-4 w-4" />
                  Check your email for OTP code.
                </p>
              )}
            </div>
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

      {/* Password Reset Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset password for {userEmail}</DialogTitle>
            <DialogDescription>
              Enter your new password below. Make sure it's strong and secure.
            </DialogDescription>
          </DialogHeader>

          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(handlePasswordReset)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          className="pr-10 border-gray-900"
                        />
                        <button
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

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        className="border-gray-900"
                        {...field}
                        type="password"
                        placeholder="Confirm new password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={passwordForm.formState.isSubmitting}
                  className="flex-1"
                >
                  {passwordForm.formState.isSubmitting ? "Resetting..." : "Reset Password"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

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
