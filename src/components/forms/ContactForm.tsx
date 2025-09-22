"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Send, Loader2, CheckCircle, Shield } from "lucide-react";
import { toast } from "sonner";
import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

// Validation schema with Zod
const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, "Name can only contain letters and spaces"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  category: z.string().min(1, "Please select a category"),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(100, "Subject must be less than 100 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
  // Honeypot field - should always be empty
  website: z.string().max(0, "Bot detected").optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      category: "",
      subject: "",
      message: "",
      website: "", // Honeypot field
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      // Verify reCAPTCHA if enabled
      let recaptchaToken = null;
      if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && recaptchaRef.current) {
        recaptchaToken = recaptchaRef.current.getValue();
        if (!recaptchaToken) {
          throw new Error("Please complete the CAPTCHA verification");
        }
      }

      // Call API endpoint
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          recaptchaToken,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send message");
      }

      const result = await response.json();

      // Success handling
      setIsSubmitted(true);
      form.reset();

      // Reset reCAPTCHA
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }

      toast.success("Message sent successfully!", {
        description: "We'll get back to you within 24 hours.",
        duration: 5000,
      });

      // Reset submitted state after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Contact form error:", error);

      // Reset reCAPTCHA on error
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }

      toast.error("Failed to send message", {
        description:
          error instanceof Error
            ? error.message
            : "Please try again later or contact us directly.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {isSubmitted ? "Message Sent!" : "Send us a Message"}
        </CardTitle>
        <p className="text-muted-foreground">
          {isSubmitted
            ? "Thank you for reaching out. We'll get back to you soon!"
            : "We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible."}
        </p>
      </CardHeader>
      <CardContent>
        {isSubmitted ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Thank you!</h3>
            <p className="text-muted-foreground">
              Your message has been sent successfully. We typically respond
              within 24 hours.
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          className="transition-all duration-300 focus:scale-105"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                          className="transition-all duration-300 focus:scale-105"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="transition-all duration-300 focus:scale-105">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="courses">
                          Course Information
                        </SelectItem>
                        <SelectItem value="technical">
                          Technical Support
                        </SelectItem>
                        <SelectItem value="billing">
                          Billing & Payments
                        </SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="career">
                          Career Opportunities
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="How can we help you?"
                        {...field}
                        className="transition-all duration-300 focus:scale-105"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us more about your inquiry..."
                        rows={5}
                        {...field}
                        className="transition-all duration-300 focus:scale-105 resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Honeypot field - hidden from users but visible to bots */}
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormLabel>Website (do not fill this out)</FormLabel>
                    <FormControl>
                      <Input {...field} tabIndex={-1} autoComplete="off" />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* reCAPTCHA */}
              {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
                <div className="flex justify-center">
                  <div className="bg-white/80 dark:bg-gray-800/80 p-2 rounded-lg border">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                      size="normal"
                      theme="light"
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 font-semibold py-3 rounded-lg group"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    Send Message
                    {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
                      <Shield className="w-4 h-4 ml-2 text-green-500" />
                    )}
                  </>
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
