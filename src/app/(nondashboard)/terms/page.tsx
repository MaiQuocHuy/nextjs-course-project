import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Scale,
  FileText,
  Users,
  CreditCard,
  Shield,
  AlertTriangle,
  BookOpen,
  UserX,
  Gavel,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | SybauEducation",
  description:
    "Read the terms and conditions for using SybauEducation platform and services.",
};

export default function TermsPage() {
  const lastUpdated = "September 22, 2025";
  const effectiveDate = "September 22, 2025";

  const sections = [
    {
      icon: Users,
      title: "Account Registration and Responsibilities",
      content: [
        {
          subtitle: "Account Creation",
          details: [
            "You must provide accurate and complete information when creating an account",
            "You are responsible for maintaining the security of your account credentials",
            "You must be at least 13 years old to create an account",
            "Each user may only maintain one active account",
          ],
        },
        {
          subtitle: "User Responsibilities",
          details: [
            "Comply with all applicable laws and regulations",
            "Respect the intellectual property rights of others",
            "Maintain appropriate conduct in all interactions",
            "Report any suspicious activity or violations to our support team",
          ],
        },
      ],
    },
    {
      icon: BookOpen,
      title: "Course Access and Usage",
      content: [
        {
          subtitle: "License to Use",
          details: [
            "We grant you a limited, non-exclusive license to access purchased courses",
            "Course content is for personal, non-commercial use only",
            "You may not redistribute, resell, or share course materials",
            "Access is provided for the lifetime of your account, subject to these terms",
          ],
        },
        {
          subtitle: "Content Quality",
          details: [
            "We strive to provide high-quality educational content",
            "Course descriptions and learning outcomes are provided in good faith",
            "We reserve the right to update course content to maintain relevance",
            "Completion certificates are issued based on course requirements",
          ],
        },
      ],
    },
    {
      icon: CreditCard,
      title: "Payments and Refunds",
      content: [
        {
          subtitle: "Payment Terms",
          details: [
            "All payments are processed securely through our payment partners",
            "Prices are displayed in USD and may be subject to applicable taxes",
            "Payment is required at the time of course enrollment",
            "We reserve the right to change prices with appropriate notice",
          ],
        },
        {
          subtitle: "Refund Policy",
          details: [
            "30-day money-back guarantee for all course purchases",
            "Refunds are processed within 5-10 business days",
            "Refund eligibility may be affected by course completion percentage",
            "Promotional pricing may have different refund terms",
          ],
        },
      ],
    },
    {
      icon: FileText,
      title: "Intellectual Property Rights",
      content: [
        {
          subtitle: "Our Content",
          details: [
            "All course materials, including videos, text, and assessments, are our property",
            "SybauEducation trademarks and logos are protected intellectual property",
            "Platform design, features, and functionality are proprietary",
            "Third-party content is used under appropriate licensing agreements",
          ],
        },
        {
          subtitle: "User-Generated Content",
          details: [
            "You retain ownership of content you create and submit",
            "You grant us a license to use your content for platform operation",
            "User content must not infringe on third-party intellectual property",
            "We may remove content that violates these terms or applicable laws",
          ],
        },
      ],
    },
    {
      icon: Shield,
      title: "Privacy and Data Protection",
      content: [
        {
          subtitle: "Data Collection",
          details: [
            "We collect information necessary to provide our services",
            "Personal data is handled in accordance with our Privacy Policy",
            "We implement industry-standard security measures",
            "You have control over your personal information and privacy settings",
          ],
        },
        {
          subtitle: "Communications",
          details: [
            "We may send service-related communications via email",
            "Marketing communications require your explicit consent",
            "You can opt out of non-essential communications at any time",
            "Important account notifications cannot be disabled",
          ],
        },
      ],
    },
    {
      icon: AlertTriangle,
      title: "Prohibited Activities",
      content: [
        {
          subtitle: "Unacceptable Behavior",
          details: [
            "Harassment, discrimination, or abusive behavior toward other users",
            "Sharing inappropriate, offensive, or illegal content",
            "Attempting to hack, disrupt, or compromise platform security",
            "Creating fake accounts or impersonating others",
          ],
        },
        {
          subtitle: "Academic Integrity",
          details: [
            "Sharing quiz answers or assessment solutions with others",
            "Using unauthorized assistance during assessments",
            "Submitting work that is not your own without proper attribution",
            "Gaming the system to obtain certificates dishonestly",
          ],
        },
      ],
    },
    {
      icon: UserX,
      title: "Account Suspension and Termination",
      content: [
        {
          subtitle: "Grounds for Action",
          details: [
            "Violation of these terms of service",
            "Suspicious or fraudulent activity",
            "Failure to pay for services",
            "Extended periods of account inactivity",
          ],
        },
        {
          subtitle: "Consequences",
          details: [
            "Temporary suspension with opportunity to resolve issues",
            "Permanent termination for serious or repeated violations",
            "Loss of access to purchased courses and certificates",
            "No refund for remaining course access or subscription fees",
          ],
        },
      ],
    },
    {
      icon: Gavel,
      title: "Legal Disclaimers and Limitations",
      content: [
        {
          subtitle: "Service Availability",
          details: [
            "We strive for 99.9% uptime but cannot guarantee uninterrupted service",
            "Scheduled maintenance may temporarily affect platform availability",
            "We are not liable for third-party service disruptions",
            "Force majeure events may affect our ability to provide services",
          ],
        },
        {
          subtitle: "Limitation of Liability",
          details: [
            "Our liability is limited to the amount you paid for our services",
            "We are not responsible for indirect or consequential damages",
            "Educational outcomes and career advancement cannot be guaranteed",
            "Users are responsible for their own learning progress and results",
          ],
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-slate-600 to-blue-600 mb-6">
            <Scale className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Please read these terms carefully. By using SybauEducation, you
            agree to be bound by these terms and conditions.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
            <Badge variant="outline">Effective Date: {effectiveDate}</Badge>
            <Badge variant="outline">Last Updated: {lastUpdated}</Badge>
          </div>
        </div>

        {/* Agreement Notice */}
        <Card className="mb-8 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">
                  Important Legal Agreement
                </h3>
                <p className="text-amber-700 dark:text-amber-400 leading-relaxed">
                  By accessing or using SybauEducation services, you acknowledge
                  that you have read, understood, and agree to be bound by these
                  Terms of Service. If you do not agree with any part of these
                  terms, you should not use our platform.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Points Overview */}
        <Card className="mb-8 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Key Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                <CreditCard className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-800 dark:text-green-300 mb-1">
                  3-Day Refunds
                </h3>
                <p className="text-sm text-green-700 dark:text-green-400">
                  Money-back guarantee on all course purchases
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                  Lifetime Access
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Access your courses for as long as your account exists
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-1">
                  Privacy Protected
                </h3>
                <p className="text-sm text-purple-700 dark:text-purple-400">
                  Your data is protected under our Privacy Policy
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-950/20">
                <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <h3 className="font-semibold text-red-800 dark:text-red-300 mb-1">
                  Fair Use Required
                </h3>
                <p className="text-sm text-red-700 dark:text-red-400">
                  Respect our community guidelines and policies
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
                    <div className="p-2 rounded-lg bg-gradient-to-r from-slate-100 to-blue-100 dark:from-slate-900/20 dark:to-blue-900/20">
                      <Icon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
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
                            <div className="w-2 h-2 rounded-full bg-slate-500 mt-2 flex-shrink-0" />
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

        {/* Updates and Changes */}
        <Card className="mt-12 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-950/20 dark:to-blue-950/20 border-slate-200 dark:border-slate-800">
          <CardContent className="py-8">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Changes to Terms
            </h3>
            <p className="text-muted-foreground mb-4 max-w-3xl mx-auto text-center leading-relaxed">
              We may update these Terms of Service from time to time. When we
              make material changes, we will notify users via email and update
              the "Last Updated" date. Continued use of our services after
              changes constitutes acceptance of the new terms.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mt-8 border-blue-200 dark:border-blue-800">
          <CardContent className="text-center py-8">
            <h3 className="text-xl font-semibold mb-4">
              Questions About These Terms?
            </h3>
            <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
              If you have any questions about these Terms of Service or need
              clarification on any section, please contact our legal team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Badge variant="outline" className="px-4 py-2">
                📧 legal@sybaueducation.com
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                📞 +84 888 194 225
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                📍 470 Tran Dai Nghia St, Ngu Hanh Son, Da Nang
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
