"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles, Clock, Users, BookOpen } from "lucide-react";
import Link from "next/link";

const highlights = [
  {
    icon: Clock,
    text: "Start learning today",
  },
  {
    icon: Users,
    text: "Join 50K+ students",
  },
  {
    icon: BookOpen,
    text: "200+ courses available",
  },
];

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-yellow-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <Card className="max-w-4xl mx-auto border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-12 text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Limited Time Offer
            </div>

            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to Transform
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block md:inline">
                {" "}
                Your Career?
              </span>
            </h2>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of successful graduates who've launched their tech
              careers with us. Start your journey today with our expert-led
              courses and personalized mentorship.
            </p>

            {/* Highlights */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 px-4 py-2 rounded-full"
                >
                  <highlight.icon className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    {highlight.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-10 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
              >
                <Link href="/dashboard">
                  Start Learning Now
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 dark:border-gray-600 px-10 py-4 text-lg font-semibold rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-muted-foreground mb-4">
                Trusted by students at top companies worldwide
              </p>
              <div className="flex justify-center items-center gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                  4.9/5 from 10,000+ reviews
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
