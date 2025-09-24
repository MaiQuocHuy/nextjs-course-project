import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Lock, Eye, UserCheck, Database, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | SybauEducation",
  description:
    "Learn how SybauEducation protects your privacy and handles your personal information.",
};

export default function PrivacyPage() {
  const lastUpdated = "September 22, 2025";

  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          details: [
            "Name, email address, and contact information when you register",
            "Profile information including bio, avatar, and educational background",
            "Payment information processed securely through our payment partners",
            "Course progress, quiz results, and learning analytics",
          ],
        },
        {
          subtitle: "Technical Information",
          details: [
            "Device information, IP address, and browser type",
            "Usage patterns, page views, and feature interactions",
            "Cookies and similar tracking technologies",
            "Log files and error reports for system optimization",
          ],
        },
      ],
    },
    {
      icon: Shield,
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Service Provision",
          details: [
            "Provide access to courses and educational content",
            "Track your learning progress and issue certificates",
            "Facilitate communication between students and instructors",
            "Process payments and manage subscriptions",
          ],
        },
        {
          subtitle: "Improvement and Analytics",
          details: [
            "Analyze usage patterns to improve our platform",
            "Personalize your learning experience and recommendations",
            "Send relevant course updates and educational content",
            "Conduct research to enhance educational outcomes",
          ],
        },
      ],
    },
    {
      icon: Lock,
      title: "Data Security and Protection",
      content: [
        {
          subtitle: "Security Measures",
          details: [
            "End-to-end encryption for sensitive data transmission",
            "Regular security audits and vulnerability assessments",
            "Secure data centers with 24/7 monitoring",
            "Multi-factor authentication for account protection",
          ],
        },
        {
          subtitle: "Access Controls",
          details: [
            "Role-based access to limit data exposure",
            "Regular review of user permissions and access rights",
            "Secure APIs with authentication and rate limiting",
            "Employee training on data protection best practices",
          ],
        },
      ],
    },
    {
      icon: UserCheck,
      title: "Your Rights and Choices",
      content: [
        {
          subtitle: "Data Control",
          details: [
            "Access and download your personal data at any time",
            "Correct inaccurate or incomplete information",
            "Delete your account and associated data",
            "Opt out of marketing communications",
          ],
        },
        {
          subtitle: "Privacy Settings",
          details: [
            "Control visibility of your profile information",
            "Manage notification preferences",
            "Choose cookie and tracking preferences",
            "Export your learning data and certificates",
          ],
        },
      ],
    },
    {
      icon: Globe,
      title: "International Data Transfers",
      content: [
        {
          subtitle: "Cross-Border Processing",
          details: [
            "Data may be processed in countries where we operate",
            "We ensure adequate protection through appropriate safeguards",
            "Compliance with GDPR for European users",
            "Regular review of data transfer agreements",
          ],
        },
      ],
    },
    {
      icon: Eye,
      title: "Third-Party Services",
      content: [
        {
          subtitle: "Service Providers",
          details: [
            "Payment processors for secure transaction handling",
            "Cloud hosting providers for reliable service delivery",
            "Analytics services to understand user behavior",
            "Communication tools for student-instructor interaction",
          ],
        },
        {
          subtitle: "Data Sharing",
          details: [
            "We never sell your personal information to third parties",
            "Limited sharing with service providers under strict agreements",
            "Anonymized data may be used for research purposes",
            "Legal compliance when required by law enforcement",
          ],
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your privacy is important to us. This policy explains how we
            collect, use, and protect your personal information when you use
            SybauEducation.
          </p>
          <Badge variant="outline" className="mt-4">
            Last updated: {lastUpdated}
          </Badge>
        </div>

        {/* Quick Overview */}
        <Card className="mb-8 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              Quick Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                <UserCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-800 dark:text-green-300 mb-1">
                  Your Control
                </h3>
                <p className="text-sm text-green-700 dark:text-green-400">
                  You have full control over your data and privacy settings
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <Lock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                  Secure Storage
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Industry-standard encryption and security measures
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-1">
                  No Sale
                </h3>
                <p className="text-sm text-purple-700 dark:text-purple-400">
                  We never sell your personal information to third parties
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {section.content.map((subsection, subIndex) => (
                    <div key={subIndex}>
                      <h4 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-200">
                        {subsection.subtitle}
                      </h4>
                      <ul className="space-y-2">
                        {subsection.details.map((detail, detailIndex) => (
                          <li
                            key={detailIndex}
                            className="flex items-start gap-2 text-muted-foreground"
                          >
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                            <span className="leading-relaxed">{detail}</span>
                          </li>
                        ))}
                      </ul>
                      {subIndex < section.content.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Contact Information */}
        <Card className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="text-center py-8">
            <h3 className="text-xl font-semibold mb-4">
              Questions About Your Privacy?
            </h3>
            <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
              If you have any questions about this privacy policy or how we
              handle your data, please don't hesitate to contact our privacy
              team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Badge variant="outline" className="px-4 py-2">
                📧 privacy@sybaueducation.com
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                📞 +84 888 194 225
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
