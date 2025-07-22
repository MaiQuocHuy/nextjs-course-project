"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";
import { getFAQs } from "@/app/data/contact";

export function FAQSection() {
  const faqs = getFAQs();
  const [openItems, setOpenItems] = useState<string[]>([]);

  return (
    <Card className="w-full shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
      <CardHeader className="text-center pb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl mx-auto mb-4">
          <HelpCircle className="w-8 h-8" />
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Frequently Asked Questions
        </CardTitle>
        <p className="text-muted-foreground">
          Find answers to common questions about our courses and platform.
        </p>
      </CardHeader>
      <CardContent>
        <Accordion
          type="multiple"
          value={openItems}
          onValueChange={setOpenItems}
          className="space-y-3"
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg px-4 transition-all duration-300 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600"
            >
              <AccordionTrigger className="text-left font-semibold hover:text-blue-600 transition-colors duration-300 hover:no-underline">
                <span className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 rounded-full text-sm font-bold">
                    {index + 1}
                  </span>
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
