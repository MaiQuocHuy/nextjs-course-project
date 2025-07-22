"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { getContactInfo } from "@/app/data/contact";

const iconMap = {
  Mail,
  Phone,
  MapPin,
  Clock,
};

export function ContactInfoSection() {
  const contactInfo = getContactInfo();

  return (
    <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about our courses or need support? We're here to
            help! Choose the best way to reach us below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info) => {
            const IconComponent = iconMap[info.icon as keyof typeof iconMap];

            return (
              <Card
                key={info.id}
                className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 border-0 shadow-lg hover:shadow-xl hover:shadow-blue-500/15 transition-all duration-300 hover:-translate-y-2 transform"
              >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/3 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <CardContent className="p-6 text-center relative z-10">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8" />
                  </div>

                  {/* Label */}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {info.label}
                  </h3>

                  {/* Value */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {info.value}
                  </p>

                  {/* Action Button */}
                  {info.href && (
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="w-full hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 transition-colors"
                    >
                      <Link
                        href={info.href}
                        target={info.type === "address" ? "_blank" : undefined}
                        rel={
                          info.type === "address"
                            ? "noopener noreferrer"
                            : undefined
                        }
                      >
                        {info.type === "email" && "Send Email"}
                        {info.type === "phone" && "Call Now"}
                        {info.type === "address" && "View on Map"}
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Map Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Visit Our Campus</h3>
          <p className="text-muted-foreground mb-6">
            Our beautiful campus is open for visits. Schedule a tour to see our
            facilities and meet our team in person.
          </p>

          {/* Mock Map Placeholder */}
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 mb-6 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">
                Interactive Map Coming Soon
              </p>
            </div>
          </div>

          <Button
            asChild
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 font-semibold px-8 py-3 rounded-lg"
          >
            <Link
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Schedule a Campus Tour
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
