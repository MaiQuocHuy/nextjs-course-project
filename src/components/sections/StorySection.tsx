import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { companyMilestones } from "@/app/data/about";
import { Calendar, ChevronRight } from "lucide-react";

export function StorySection() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Story Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Calendar className="w-4 h-4" />
              Our Journey
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              The Story Behind
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {" "}
                SybauEducation
              </span>
            </h2>

            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                SybauEducation was born from a simple yet powerful idea: that
                everyone deserves access to quality education, regardless of
                their circumstances. In 2019, our founders recognized the
                growing gap between traditional education and the rapidly
                evolving demands of the digital economy.
              </p>
              <p>
                What started as a small team of passionate educators and
                technologists has grown into a global platform serving students
                in over 120 countries. We've helped thousands of learners
                transform their careers, start new ventures, and achieve their
                dreams through practical, industry-relevant education.
              </p>
              <p>
                Today, we continue to innovate and expand our offerings, always
                staying true to our core mission: making world-class education
                accessible, affordable, and effective for learners everywhere.
              </p>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-green-50/50 to-blue-50/50 dark:from-green-950/20 dark:to-blue-950/20 rounded-xl border border-green-100 dark:border-green-900/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Our Vision</h3>
                  <p className="text-muted-foreground">
                    A world where geographical boundaries, financial
                    constraints, and traditional barriers no longer limit
                    anyone's potential to learn, grow, and succeed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-2xl font-bold mb-8">Key Milestones</h3>
            <div className="space-y-6">
              {companyMilestones.map((milestone, index) => (
                <Card
                  key={milestone.id}
                  className="group border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all duration-300 hover:shadow-md"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                          {milestone.year}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors">
                          {milestone.title}
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {milestone.description}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
