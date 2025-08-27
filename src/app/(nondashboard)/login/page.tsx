"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Award, BookOpen, Eye, EyeOff, Loader2, TrendingUp, Users } from "lucide-react";

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
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const { login, isLoading, error } = useAuth();
  const { isAuthenticated, isReady } = useAuthStatus();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "bob@example.com",
      password: "bob123",
    },
  });

  // Check for URL error parameters (like from Google OAuth)
  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError) {
      let errorMessage = "";

      switch (urlError) {
        case "EmailNotVerified":
          errorMessage =
            "Your Google account email is not verified. Please verify your email with Google and try again.";
          break;
        case "OAuthAccountNotLinked":
          errorMessage = "This account is already associated with a different sign-in method.";
          break;
        default:
          errorMessage = "Authentication failed. Please try again.";
      }

      setModalMessage(errorMessage);
      setShowErrorModal(true);

      // Clean up URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("error");
      window.history.replaceState({}, "", newUrl.toString());
    }
  }, [searchParams]);

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
    <div className="min-h-screen relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://i.guim.co.uk/img/media/ff62b3c21bbad476a158b1639cb4fff88d4ea28c/0_286_5867_3520/master/5867.jpg?width=700&quality=85&auto=format&fit=max&s=33dd4e5eb0c3f96c22f3171a51ac8530')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 via-purple-900/50 to-blue-900/60"></div>
      </div>

      {/* Show loading state while checking authentication */}
      {!isReady ? (
        <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
          <Card className="w-full max-w-md shadow-2xl border-0">
            <CardContent className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <span className="ml-3 text-lg font-medium text-slate-700">Loading...</span>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="min-h-screen flex relative z-10">
          <div className="flex-1 flex items-center justify-center  px-4 py-12 sm:px-6 lg:pl-16 lg:pr-8 xl:pl-20 xl:pr-12">
            <div className="w-full max-w-md space-y-8">
              {/* Logo/Brand Section */}
              <div className="text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-indigo-600 p-3 rounded-2xl">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Welcome back</h1>
                <p className="text-blue-100 text-lg drop-shadow-md">
                  Continue your learning journey
                </p>
              </div>

              <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-md">
                <CardContent className="p-8 space-y-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                      {/* Email Field */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              Email Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Enter your email"
                                className="h-12 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 bg-white/70"
                                {...field}
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
                              <FormLabel className="text-slate-700 font-medium">Password</FormLabel>
                              <Link
                                tabIndex={-1}
                                href="/forgot-password"
                                className="text-sm text-indigo-600 hover:text-indigo-500 hover:underline font-medium"
                              >
                                Forgot password?
                              </Link>
                            </div>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Enter your password"
                                  className="h-12 pr-12 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 bg-white/70"
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-slate-400" />
                                  ) : (
                                    <Eye className="h-5 w-5 text-slate-400" />
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
                        className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200"
                        disabled={isLoading || isGoogleLoading || !isReady}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          "Sign in to your account"
                        )}
                      </Button>
                    </form>
                  </Form>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-sm uppercase">
                      <span className=" px-4 text-slate-500 font-medium">OR</span>
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
                    className="w-full h-12 flex items-center justify-center gap-3 border-slate-200 hover:bg-slate-50 font-medium text-base"
                  >
                    {isGoogleLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <GoogleIcon />
                        <span>Continue with Google</span>
                      </>
                    )}
                  </Button>

                  {/* Register Link */}
                  <div className="text-center text-slate-600">
                    {"Don't have an account? "}
                    <Link
                      href="/register"
                      className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
                    >
                      Create one now
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
            <div className="relative z-10 flex flex-col justify-center px-6 xl:px-8 text-white">
              <div className="max-w-lg">
                <h2 className="text-4xl xl:text-5xl font-bold leading-tight mb-6 text-white drop-shadow-lg">
                  Unlock Your Potential with Expert-Led Courses
                </h2>
                <p className="text-xl text-blue-50 mb-8 leading-relaxed drop-shadow-md">
                  Join thousands of learners advancing their careers through our comprehensive
                  online learning platform.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/30 p-2 rounded-lg backdrop-blur-sm">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white drop-shadow-md">50K+</div>
                      <div className="text-blue-50 text-sm drop-shadow-sm">Active Students</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/30 p-2 rounded-lg backdrop-blur-sm">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white drop-shadow-md">1,200+</div>
                      <div className="text-blue-50 text-sm drop-shadow-sm">Courses</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/30 p-2 rounded-lg backdrop-blur-sm">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white drop-shadow-md">95%</div>
                      <div className="text-blue-50 text-sm drop-shadow-sm">Success Rate</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/30 p-2 rounded-lg backdrop-blur-sm">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white drop-shadow-md">4.8/5</div>
                      <div className="text-blue-50 text-sm drop-shadow-sm">Rating</div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-200 rounded-full shadow-sm"></div>
                    <span className="text-blue-50 drop-shadow-sm">Learn at your own pace</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-200 rounded-full shadow-sm"></div>
                    <span className="text-blue-50 drop-shadow-sm">
                      Get certified upon completion
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-200 rounded-full shadow-sm"></div>
                    <span className="text-blue-50 drop-shadow-sm">
                      Access to expert instructors
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <DialogTitle className="text-center text-xl font-semibold text-slate-900">
              Login Successful!
            </DialogTitle>
            <DialogDescription className="text-center text-slate-600 mt-2">
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
            <DialogTitle className="text-center text-xl font-semibold text-slate-900">
              Login Failed
            </DialogTitle>
            <DialogDescription className="text-center text-slate-600 mt-2">
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
  );
}
