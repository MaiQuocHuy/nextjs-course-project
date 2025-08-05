"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Play,
  Award,
  Users,
  MessageCircle,
  Settings,
  Download,
  Smartphone,
  Monitor,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export default function GettingStartedPage() {
  const steps = [
    {
      title: "Explore Your Dashboard",
      description: "View all your enrolled courses and track your progress",
      icon: <Monitor className="w-5 h-5" />,
      link: "/dashboard",
    },
    {
      title: "Start Your First Lesson",
      description: "Click on any course to begin learning immediately",
      icon: <Play className="w-5 h-5" />,
      link: "/courses",
    },
    {
      title: "Track Your Progress",
      description: "See how much you've completed and what's next",
      icon: <Award className="w-5 h-5" />,
      link: "/dashboard",
    },
    {
      title: "Join the Community",
      description: "Connect with other learners and instructors",
      icon: <Users className="w-5 h-5" />,
      link: "/community",
    },
  ];

  const features = [
    {
      title: "HD Video Lectures",
      description: "High-quality video content with subtitle support",
      icon: <Play className="w-5 h-5 text-blue-500" />,
    },
    {
      title: "Interactive Exercises",
      description: "Hands-on coding exercises and quizzes",
      icon: <BookOpen className="w-5 h-5 text-green-500" />,
    },
    {
      title: "Progress Tracking",
      description: "Track your learning progress and achievements",
      icon: <Award className="w-5 h-5 text-yellow-500" />,
    },
    {
      title: "Community Support",
      description: "Get help from instructors and fellow students",
      icon: <MessageCircle className="w-5 h-5 text-purple-500" />,
    },
    {
      title: "Mobile Learning",
      description: "Learn on-the-go with our mobile-friendly platform",
      icon: <Smartphone className="w-5 h-5 text-pink-500" />,
    },
    {
      title: "Downloadable Resources",
      description: "Access course materials offline",
      icon: <Download className="w-5 h-5 text-indigo-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Getting Started Guide
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Welcome to our learning platform! Here's everything you need to know
            to get the most out of your courses.
          </p>
        </div>

        {/* Quick Start Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              Quick Start Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {steps.map((step, index) => (
                <Card
                  key={index}
                  className="border-2 hover:border-blue-300 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{step.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {step.description}
                        </p>
                        <Button asChild size="sm" variant="outline">
                          <Link href={step.link}>Go Now</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platform Features */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg border"
                >
                  {feature.icon}
                  <div>
                    <h4 className="font-medium mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips for Success */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-400">
              Tips for Successful Learning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">
                  Set aside dedicated time for learning each day
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">
                  Take notes while watching videos
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">
                  Practice coding exercises immediately after learning
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">
                  Join discussions and ask questions in the community
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">
                  Review previous lessons before moving to new topics
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Need More Help */}
        <Card>
          <CardHeader>
            <CardTitle>Need More Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/help">Browse Help Articles</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/community">Join Community</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
