"use client";

import { CourseCard } from "./CourseCard";
import { Course } from "@/app/data/courses";

interface CourseListProps {
  courses: Course[];
  className?: string;
}

export function CourseList({ courses, className = "" }: CourseListProps) {
  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No courses available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
