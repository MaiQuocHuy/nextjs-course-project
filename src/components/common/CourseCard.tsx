"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Course } from "@/app/data/courses";

interface CourseCardProps {
  course: Course;
  className?: string;
}

export function CourseCard({ course, className = "" }: CourseCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatStudentsCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <Card
      className={`group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 ${className}`}
    >
      <div className="relative overflow-hidden">
        <Image
          src={course.thumbnail || "/placeholder-course.jpg"}
          alt={course.title}
          width={400}
          height={225}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <Badge
            variant="secondary"
            className="bg-white/90 text-black hover:bg-white"
          >
            {course.categories?.[0]?.name || "Course"}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Badge className="bg-primary/90 text-primary-foreground hover:bg-primary">
            {formatPrice(course.price)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Image
                src={course.instructor?.avatar || "/placeholder-avatar.jpg"}
                alt={course.instructor?.name || "Instructor"}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span>{course.instructor?.name}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(course.rating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">
                {course.rating?.toFixed(1)}
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{formatStudentsCount(course.studentsCount || 0)}</span>
              </div>
              {course.sections && course.sections.length > 0 && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {course.sections.reduce(
                      (total, section) =>
                        total + (section.lessons?.length || 0),
                      0
                    )}{" "}
                    lessons
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button
          asChild
          className="w-full group-hover:bg-primary/90 transition-colors"
        >
          <Link href={`/courses/${course.id}`}>View Course</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
