"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth, useAuthStatus } from "@/hooks/useAuth";
import { handleGoogleSignIn } from "@/utils/common/login";
import GoogleIcon from "@/components/common/GoogleIcon";

// Zod validation schema
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z
    .string()
    // .min(8, "Password must be at least 8 characters")
    // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const router = useRouter();
  const { login, isLoading, error } = useAuth();
  const { isAuthenticated, isReady } = useAuthStatus();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "bob@example.com",
      password: "bob123",
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isReady, router]);

  // Show authentication errors
  useEffect(() => {
    if (error) {
      setModalMessage(error);
      setShowErrorModal(true);
    }
  }, [error]);

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const result = await login({
        email: values.email,
        password: values.password,
      });

      if (result.success) {
        setModalMessage("Login successful!");
        setShowSuccessModal(true);

        const returnUrl = new URLSearchParams(window.location.search).get("returnUrl") || "/";
        router.replace(returnUrl);
      } else {
        setModalMessage(result.error || "Login failed. Please check your credentials.");
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      setModalMessage("Something went wrong. Please try again.");
      setShowErrorModal(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e5ecff] px-4 py-12 sm:px-6 lg:px-8">
      {/* Show loading state while checking authentication */}
      {!isReady ? (
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardContent className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg">Loading...</span>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="w-full max-w-md space-y-8">
          <Card className="shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
              <CardDescription className="text-gray-600">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            {...field}
                            className="h-11 border-gray-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password Field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Password</FormLabel>
                          <Link
                            href="/forgot-password"
                            className="text-sm text-blue-600 hover:text-blue-500 hover:underline"
                          >
                            Forgot your password?
                          </Link>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              {...field}
                              className="h-11 pr-10 border-gray-900"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-900" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-900" />
                              )}
                              <span className="sr-only">
                                {showPassword ? "Hide password" : "Show password"}
                              </span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-11"
                    disabled={isLoading || isGoogleLoading || !isReady}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </form>
              </Form>
              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">OR</span>
                </div>
              </div>

              {/* Google OAuth Button */}
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  handleGoogleSignIn(
                    router,
                    setModalMessage,
                    setShowErrorModal,
                    setShowSuccessModal,
                    setIsGoogleLoading
                  );
                }}
                disabled={isLoading || isGoogleLoading || !isReady}
                className="w-full h-11 flex items-center justify-center gap-3 border-gray-300 hover:bg-gray-50"
              >
                {isGoogleLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <GoogleIcon />
                    <span>Sign in with Google</span>
                  </>
                )}
              </Button>

              {/* Register Link */}
              <div className="text-center text-sm text-gray-600">
                {"Don't have an account? "}
                <Link
                  href="/register"
                  className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
                >
                  Register now
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Success Modal */}
          <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <DialogTitle className="text-center text-xl font-semibold text-gray-900">
                  Login Successful!
                </DialogTitle>
                <DialogDescription className="text-center text-gray-600 mt-2">
                  {modalMessage}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          {/* Error Modal */}
          <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <DialogTitle className="text-center text-xl font-semibold text-gray-900">
                  Login Failed
                </DialogTitle>
                <DialogDescription className="text-center text-gray-600 mt-2">
                  {modalMessage}
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-center mt-6">
                <Button onClick={() => setShowErrorModal(false)} variant="outline" className="px-8">
                  Try Again
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
