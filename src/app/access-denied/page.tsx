"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldX, Home, LogIn, ArrowLeft } from "lucide-react";

export default function AccessDenied() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleNavigate = () => {
    if (session) {
      router.push("/");
    } else {
      router.push("/login");
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-4">
      <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/30">
              <ShieldX className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Access Denied
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
            {session
              ? "You don't have permission to access this page. Please contact an administrator if you believe this is an error."
              : "You need to be logged in to access this page. Please sign in to continue."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            onClick={handleNavigate}
            className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            {session ? (
              <>
                <Home className="w-5 h-5 mr-2" />
                Go to Home
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </>
            )}
          </Button>

          <Button
            onClick={handleGoBack}
            variant="outline"
            className="w-full h-12 text-base font-medium border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>

          {session && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Signed in as:{" "}
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {session.user?.email}
                </span>
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
                Role:{" "}
                <span className="font-medium capitalize">{(session as any)?.role || "User"}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
