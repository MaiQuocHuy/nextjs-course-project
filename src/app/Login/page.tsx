"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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

// Zod validation schema
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

// Mock login function
const mockLogin = async (
  email: string,
  password: string
): Promise<{ success: boolean; message: string }> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock logic: success if email is "user@example.com" and password is "Password123"
  if (email === "user@example.com" && password === "Password123") {
    return { success: true, message: "Login successful! Welcome back." };
  } else {
    return { success: false, message: "Invalid email or password. Please try again." };
  }
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);

    try {
      const result = await mockLogin(values.email, values.password);

      if (result.success) {
        setModalMessage(result.message);
        setShowSuccessModal(true);
        console.log("Login successful, remember me:", values.rememberMe);
      } else {
        setModalMessage(result.message);
        setShowErrorModal(true);
      }
    } catch (error) {
      setModalMessage("Something went wrong. Please try again.");
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
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
                          className="h-11"
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
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            {...field}
                            className="h-11 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
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

                {/* Remember Me Checkbox */}
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          Remember me for 30 days
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button type="submit" className="w-full h-11" disabled={isLoading}>
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

            {/* Demo Credentials */}
            <div className="rounded-md bg-blue-50 p-4">
              <div className="text-sm">
                <p className="font-medium text-blue-800 mb-1">Demo Credentials:</p>
                <p className="text-blue-700">Email: user@example.com</p>
                <p className="text-blue-700">Password: Password123</p>
              </div>
            </div>

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
            <div className="flex justify-center mt-6">
              <Button onClick={() => setShowSuccessModal(false)} className="px-8">
                Continue
              </Button>
            </div>
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
    </div>
  );
}
