import React from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { TopCoursesSection } from "@/components/sections/TopCoursesSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { CTASection } from "@/components/sections/CTASection";

const HomePage = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <TopCoursesSection />
      <AboutSection />
      <TestimonialsSection />
      <PartnersSection />
      <CTASection />
    </main>
  );
};

export default HomePage;
