"use client";

import React from "react";
import { AboutStatsSection } from "@/components/sections/AboutStatsSection";
import { ValuesSection } from "@/components/sections/ValuesSection";
import { StorySection } from "@/components/sections/StorySection";
import { TeamSection } from "@/components/sections/TeamSection";
import { Button } from "@/components/ui/button";
import { Compass, Target, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-green-950/20 dark:via-background dark:to-blue-950/20">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-green-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Compass className="w-4 h-4" />
              About Us
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Our
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {" "}
                Mission
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed">
              We're on a mission to democratize quality education and empower
              learners worldwide to unlock their full potential through
              accessible, practical, and transformative learning experiences.
            </p>

            {/* Mission Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl border border-green-100 dark:border-green-900">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">Accessible</h3>
                <p className="text-sm text-muted-foreground">
                  Quality education available to everyone, everywhere
                </p>
              </div>

              <div className="text-center p-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl border border-blue-100 dark:border-blue-900">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                  <Compass className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">Practical</h3>
                <p className="text-sm text-muted-foreground">
                  Real-world skills for immediate application
                </p>
              </div>

              <div className="text-center p-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl border border-purple-100 dark:border-purple-900">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">Transformative</h3>
                <p className="text-sm text-muted-foreground">
                  Learning experiences that change lives
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <AboutStatsSection />

      {/* Story Section */}
      <StorySection />

      {/* Values Section */}
      <ValuesSection />

      {/* Team Section */}
      <TeamSection />

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container mx-auto px-4">
          <div className="text-center text-white max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl mb-8 text-green-100">
              Become part of a global learning community that's transforming
              lives through education. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => (window.location.href = "/courses")}
                className="bg-white text-green-600 hover:bg-green-50 px-8 py-4 font-semibold rounded-xl"
              >
                Browse Courses
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => (window.location.href = "/contact")}
                className="border-2 border-white text-green-600 hover:bg-white/10 px-8 py-4 font-semibold rounded-xl"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
