"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  BookOpen,
  Play,
  Award,
  Users,
  MessageCircle,
  Settings,
  CreditCard,
  Shield,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      title: "Getting Started",
      description: "Learn the basics of using our platform",
      icon: <BookOpen className="w-6 h-6 text-blue-500" />,
      articles: [
        { title: "Platform Introduction", href: "/help/getting-started" },
        { title: "Creating Your Profile", href: "/help/profile-setup" },
        { title: "Enrolling in Courses", href: "/help/enrollment" },
        { title: "Navigation Guide", href: "/help/navigation" },
      ],
    },
    {
      title: "Learning & Courses",
      description: "Everything about courses and learning experience",
      icon: <Play className="w-6 h-6 text-green-500" />,
      articles: [
        { title: "How to Watch Videos", href: "/help/video-playback" },
        { title: "Taking Notes", href: "/help/notes" },
        { title: "Downloading Resources", href: "/help/downloads" },
        { title: "Progress Tracking", href: "/help/progress" },
      ],
    },
    {
      title: "Payments & Billing",
      description: "Payment methods, refunds, and billing questions",
      icon: <CreditCard className="w-6 h-6 text-purple-500" />,
      articles: [
        { title: "Payment Methods", href: "/help/payment-methods" },
        { title: "Refund Policy", href: "/help/refunds" },
        { title: "Billing Issues", href: "/help/billing" },
        { title: "Course Pricing", href: "/help/pricing" },
      ],
    },
    {
      title: "Certificates & Progress",
      description: "Earning and managing your certificates",
      icon: <Award className="w-6 h-6 text-yellow-500" />,
      articles: [
        { title: "Earning Certificates", href: "/help/certificates" },
        {
          title: "Downloading Certificates",
          href: "/help/certificate-download",
        },
        { title: "Sharing Achievements", href: "/help/sharing" },
        { title: "Progress Requirements", href: "/help/requirements" },
      ],
    },
    {
      title: "Community & Support",
      description: "Connecting with others and getting help",
      icon: <Users className="w-6 h-6 text-pink-500" />,
      articles: [
        { title: "Community Guidelines", href: "/help/community-rules" },
        { title: "Asking Questions", href: "/help/questions" },
        { title: "Reporting Issues", href: "/help/reporting" },
        { title: "Instructor Contact", href: "/help/instructor-contact" },
      ],
    },
    {
      title: "Account & Settings",
      description: "Managing your account and preferences",
      icon: <Settings className="w-6 h-6 text-indigo-500" />,
      articles: [
        { title: "Account Settings", href: "/help/account" },
        { title: "Password Reset", href: "/help/password" },
        { title: "Email Preferences", href: "/help/notifications" },
        { title: "Privacy Settings", href: "/help/privacy" },
      ],
    },
  ];

  const popularArticles = [
    {
      title: "How to get started with your first course",
      category: "Getting Started",
      href: "/help/getting-started",
    },
    {
      title: "Payment methods and billing",
      category: "Payments",
      href: "/help/payment-methods",
    },
    {
      title: "How to earn course certificates",
      category: "Certificates",
      href: "/help/certificates",
    },
    {
      title: "Troubleshooting video playback issues",
      category: "Technical",
      href: "/help/video-issues",
    },
    {
      title: "Refund policy and how to request refunds",
      category: "Payments",
      href: "/help/refunds",
    },
  ];

  const filteredCategories = categories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.articles.some((article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Help Center
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find answers to common questions and learn how to make the most of
            our platform.
          </p>

          {/* Search */}
          <div className="max-w-lg mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Button
            asChild
            size="lg"
            className="h-auto p-6 bg-blue-600 hover:bg-blue-700"
          >
            <Link
              href="/help/getting-started"
              className="flex flex-col items-center gap-2"
            >
              <BookOpen className="w-8 h-8" />
              <div className="text-center">
                <div className="font-semibold">Getting Started</div>
                <div className="text-sm opacity-90">New to our platform?</div>
              </div>
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="h-auto p-6">
            <Link href="/contact" className="flex flex-col items-center gap-2">
              <MessageCircle className="w-8 h-8" />
              <div className="text-center">
                <div className="font-semibold">Contact Support</div>
                <div className="text-sm opacity-70">Get personalized help</div>
              </div>
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="h-auto p-6">
            <Link
              href="/community"
              className="flex flex-col items-center gap-2"
            >
              <Users className="w-8 h-8" />
              <div className="text-center">
                <div className="font-semibold">Community</div>
                <div className="text-sm opacity-70">Ask the community</div>
              </div>
            </Link>
          </Button>
        </div>

        {/* Popular Articles */}
        {!searchQuery && (
          <Card>
            <CardHeader>
              <CardTitle>Popular Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {popularArticles.map((article, index) => (
                  <Link
                    key={index}
                    href={article.href}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{article.title}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {article.category}
                      </Badge>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {category.icon}
                  <div>
                    <div className="text-lg">{category.title}</div>
                    <div className="text-sm font-normal text-gray-600 dark:text-gray-400">
                      {category.description}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {category.articles.map((article, articleIndex) => (
                    <Link
                      key={articleIndex}
                      href={article.href}
                      className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <span className="text-sm">{article.title}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Support */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <HelpCircle className="w-12 h-12 mx-auto text-blue-600" />
              <div>
                <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-400 mb-2">
                  Still Need Help?
                </h3>
                <p className="text-blue-700 dark:text-blue-300 mb-4">
                  Can't find what you're looking for? Our support team is here
                  to help.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/community">Ask Community</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
