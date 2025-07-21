"use client";

import { Card, CardContent } from "@/components/ui/card";
import { getAllPartners } from "@/app/data/partners";
import Image from "next/image";
import { Handshake } from "lucide-react";

export function PartnersSection() {
  const partners = getAllPartners();

  return (
    <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Handshake className="w-4 h-4" />
            Trusted Partners
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Learn From The Best
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We partner with leading companies and institutions to bring you
            cutting-edge curriculum and real-world expertise.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {partners.map((partner) => (
            <Card
              key={partner.id}
              className="group hover:shadow-lg hover:shadow-gray-500/10 transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/20 cursor-pointer"
            >
              <CardContent className="p-6 flex items-center justify-center">
                <div className="relative w-full h-16 flex items-center justify-center">
                  <Image
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    width={120}
                    height={60}
                    className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110"
                    priority
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground">
            Join <span className="font-semibold text-blue-600">50,000+</span>{" "}
            students learning with industry-standard tools and methodologies
          </p>
        </div>
      </div>
    </section>
  );
}
