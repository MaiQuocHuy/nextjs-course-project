"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { CourseList } from "@/components/common/CourseList";
import { getFeaturedCourses } from "@/app/data/courses";

export function TopCoursesSection() {
  const featuredCourses = getFeaturedCourses();

  return (
    <section
      id="courses-section"
      className="py-20 bg-gradient-to-b from-background to-muted/20"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            Most Popular
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Top-Rated Courses
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students learning from industry experts. Start
            your journey with our most popular and highly-rated courses.
          </p>
        </div>

        <CourseList courses={featuredCourses} className="mb-12" />

        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
          >
            <Link href="/courses">
              View All Courses
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
