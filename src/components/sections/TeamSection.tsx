"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Linkedin, Twitter, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getTeamMembers } from "@/app/data/contact";

export function TeamSection() {
  const teamMembers = getTeamMembers();

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Users className="w-4 h-4" />
            Meet Our Team
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The People Behind
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              SybauEducation
            </span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our passionate team of educators, engineers, and innovators is
            dedicated to transforming the way people learn and grow in their
            careers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <Card
              key={member.id}
              className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 border-0 shadow-lg hover:shadow-xl hover:shadow-blue-500/15 transition-all duration-300 hover:-translate-y-2 transform"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/3 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <CardContent className="p-6 text-center relative z-10">
                {/* Avatar */}
                <div className="relative mx-auto mb-4">
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden ring-4 ring-blue-100 dark:ring-blue-900 group-hover:ring-blue-300 dark:group-hover:ring-blue-700 transition-all duration-300">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  {/* Online Status */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* Name & Title */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                  {member.name}
                </h3>
                <Badge
                  variant="secondary"
                  className="mb-3 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-0"
                >
                  {member.title}
                </Badge>

                {/* Bio */}
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  {member.bio}
                </p>

                {/* Social Links */}
                <div className="flex justify-center gap-2">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 transition-colors"
                  >
                    <Link href={`mailto:${member.email}`}>
                      <Mail className="w-4 h-4" />
                    </Link>
                  </Button>

                  {member.linkedin && (
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 transition-colors"
                    >
                      <Link
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="w-4 h-4" />
                      </Link>
                    </Button>
                  )}

                  {member.twitter && (
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 transition-colors"
                    >
                      <Link
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Twitter className="w-4 h-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Join Team CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Join Our Team</h3>
            <p className="text-muted-foreground mb-6">
              We're always looking for talented individuals who share our
              passion for education and technology.
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 font-semibold px-8 py-3 rounded-lg"
            >
              <Link href="/careers">View Open Positions</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
