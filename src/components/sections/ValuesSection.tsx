import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { companyValues } from "@/app/data/about";
import {
  Trophy,
  Heart,
  Lightbulb,
  Users,
  TrendingUp,
  Target,
} from "lucide-react";

const iconMap = {
  Trophy,
  Heart,
  Lightbulb,
  Users,
  TrendingUp,
  Target,
};

export function ValuesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Target className="w-4 h-4" />
            Our Values
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            What We
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Stand For
            </span>
          </h2>

          <p className="text-xl text-muted-foreground leading-relaxed">
            Our values guide everything we do, from the courses we create to the
            way we support our community of learners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {companyValues.map((value) => {
            const IconComponent = iconMap[value.icon as keyof typeof iconMap];

            return (
              <Card
                key={value.id}
                className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-900/80"
              >
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-7 h-7 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
