"use client";

import React from "react";
import { ContactInfoSection } from "@/components/sections/ContactInfoSection";
import { ContactForm } from "@/components/forms/ContactForm";
import { TeamSection } from "@/components/sections/TeamSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { MessageCircle, Target, Users } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-background dark:to-purple-950/20">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-pink-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <MessageCircle className="w-4 h-4" />
              Contact Us
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Let's Start a
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Conversation
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Whether you have questions about our courses, need technical
              support, or want to explore partnership opportunities, we're here
              to help.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl border border-blue-100 dark:border-blue-900">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  24/7
                </div>
                <div className="text-sm text-muted-foreground">
                  Support Available
                </div>
              </div>
              <div className="text-center p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl border border-purple-100 dark:border-purple-900">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  &lt;2hrs
                </div>
                <div className="text-sm text-muted-foreground">
                  Response Time
                </div>
              </div>
              <div className="text-center p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl border border-pink-100 dark:border-pink-900">
                <div className="text-2xl font-bold text-pink-600 mb-1">
                  50K+
                </div>
                <div className="text-sm text-muted-foreground">
                  Happy Students
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <ContactInfoSection />

      {/* Contact Form & FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>

            {/* FAQ */}
            <div>
              <FAQSection />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Target className="w-4 h-4" />
                Our Mission
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Democratizing Quality
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  {" "}
                  Education
                </span>
              </h2>

              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  At SybauEducation, we believe that everyone deserves access to
                  world-class education, regardless of their background,
                  location, or financial situation.
                </p>
                <p>
                  Our mission is to bridge the gap between traditional education
                  and the rapidly evolving demands of the modern workforce by
                  providing practical, industry-relevant courses that prepare
                  students for real-world success.
                </p>
                <p>
                  We're committed to creating an inclusive learning environment
                  where curiosity is celebrated, innovation is encouraged, and
                  every student has the support they need to thrive.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 rounded-xl">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    2019
                  </div>
                  <div className="text-sm text-muted-foreground">Founded</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    120+
                  </div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-white to-green-50/50 dark:from-gray-900 dark:to-green-950/20 rounded-3xl p-8 border border-green-100 dark:border-green-900/20">
                <div className="aspect-square bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/50 dark:to-blue-900/50 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <Target className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Our Vision</h3>
                    <p className="text-sm text-muted-foreground">
                      A world where quality education is accessible to everyone,
                      everywhere.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <TeamSection />
    </main>
  );
}
