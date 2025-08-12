import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Mail, User } from "lucide-react";
import type { UserInfoCardProps } from "../types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export function UserInfoCard({ userData }: UserInfoCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">User Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <Avatar className="h-24 w-24 sm:h-28 sm:w-28">
              <AvatarImage
                src={userData.avatar || "/placeholder.svg"}
                alt={userData.name}
                className="object-cover"
              />
              <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-600">
                {userData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* User Details */}
          <div className="flex-1 space-y-4 text-center sm:text-left">
            {/* Full Name */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 break-words">{userData.name}</h2>
            </div>

            <div className="grid gap-3">
              {/* Email */}
              <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="text-base truncate">{userData.email}</span>
              </div>

              {/* Role */}
              <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600">
                <User className="h-4 w-4 flex-shrink-0" />
                <span className="text-base font-medium">{userData.role}</span>
              </div>

              {/* Joined Date */}
              <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600">
                <CalendarDays className="h-4 w-4 flex-shrink-0" />
                <span className="text-base">Joined on {userData.joinedDate}</span>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="flex-shrink-0">
            <Button asChild variant="outline" className="gap-2 hover:bg-gray-50 bg-transparent">
              <Link href="/settings">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
