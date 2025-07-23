"use client";

import { CourseCard } from "./CourseCard";
import { Course } from "@/app/data/courses";

interface CourseListProps {
  courses: Course[];
  className?: string;
  variant?: "grid" | "list";
}

export function CourseList({
  courses,
  className = "",
  variant = "grid",
}: CourseListProps) {
  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No courses available at the moment.
        </p>
      </div>
    );
  }

  // Default grid layout for homepage/general use
  const defaultGridClasses = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

  return (
    <div className={`grid ${className || defaultGridClasses}`}>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} variant={variant} />
      ))}
    </div>
  );
}
