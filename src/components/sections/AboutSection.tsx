"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Trophy,
  BookOpen,
  Clock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const stats = [
  {
    icon: Users,
    value: "50,000+",
    label: "Active Students",
    description: "Students from 120+ countries",
  },
  {
    icon: BookOpen,
    value: "200+",
    label: "Expert Courses",
    description: "Across multiple technologies",
  },
  {
    icon: Trophy,
    value: "95%",
    label: "Success Rate",
    description: "Students land their dream jobs",
  },
  {
    icon: Clock,
    value: "24/7",
    label: "Expert Support",
    description: "Always available to help",
  },
];

const features = [
  "Industry-leading curriculum designed by experts",
  "Hands-on projects with real-world applications",
  "Personalized learning paths and mentorship",
  "Job placement assistance and career guidance",
  "Lifetime access to course materials and updates",
  "Active community of learners and professionals",
];

export function AboutSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* About Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Trophy className="w-4 h-4" />
              About EduPlatform
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Empowering Careers Through
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Technology Education
              </span>
            </h2>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              We're on a mission to democratize quality tech education. Our
              platform connects ambitious learners with industry experts,
              providing the skills and knowledge needed to succeed in today's
              digital economy.
            </p>

            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
              >
                <Link href="/about">
                  Learn More About Us
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 px-8 py-3 text-lg font-semibold rounded-full hover:bg-muted transition-colors"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-950/20 rounded-3xl p-8 border border-blue-100 dark:border-blue-900/20">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                  alt="Students learning together"
                  width={600}
                  height={400}
                  className="rounded-2xl object-cover w-full"
                  priority
                />

                {/* Floating Elements */}
                <div className="absolute -top-4 -left-4 bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-4 rounded-2xl shadow-lg">
                  <Trophy className="w-8 h-8" />
                </div>

                <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-green-400 to-blue-500 text-white p-4 rounded-2xl shadow-lg">
                  <BookOpen className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="text-center group hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-950/20"
            >
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-8 h-8" />
                </div>

                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {stat.value}
                </div>

                <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {stat.label}
                </div>

                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
