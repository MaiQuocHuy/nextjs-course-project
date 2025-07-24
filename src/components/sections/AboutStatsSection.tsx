import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { companyStats } from "@/app/data/about";

export function AboutStatsSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {companyStats.map((stat) => (
            <Card
              key={stat.id}
              className="text-center border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
