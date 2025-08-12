"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { UserInfoCard } from "@/components/profile/UserInfoCard";
import { ProfileCourseList } from "@/components/profile/CourseListProfile";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#e5ecff] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Page Header with Back Button */}
        <div className="mb-8 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-4"
            onClick={() => window.history.back()}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        </div>

        <div className="space-y-8">
          {/* Section A: User Information */}
          <UserInfoCard />

          {/* Section B: Enrolled Courses */}
          <ProfileCourseList />
        </div>
      </div>
    </div>
  );
}
