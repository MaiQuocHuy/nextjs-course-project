"use client";

import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  GraduationCap,
  Heart,
  ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const socialLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      href: "#",
      color: "hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "#",
      color: "hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20",
    },
    {
      name: "YouTube",
      icon: Youtube,
      href: "#",
      color: "hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20",
    },
    {
      name: "Email",
      icon: Mail,
      href: "mailto:contact@eduplatform.com",
      color: "hover:text-primary hover:bg-primary/10",
    },
  ];

  const footerLinks = [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t backdrop-blur-xl bg-white/80 dark:bg-black/80 shadow-lg shadow-black/5 dark:shadow-white/5 mt-auto">
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Scroll to Top Button */}
          <Button
            onClick={scrollToTop}
            className="group absolute -top-6 right-6 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/25 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <ArrowUp className="h-5 w-5 text-white transition-transform duration-300 group-hover:-translate-y-0.5" />
          </Button>

          {/* Brand Section */}
          <div className="flex flex-col items-center space-y-3">
            <div className="group transition-all duration-300 hover:scale-105 hover:rotate-1">
              <Link
                href="/"
                className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg p-1"
              >
                <GraduationCap className="h-8 w-8 text-primary transition-all duration-300 group-hover:drop-shadow-lg group-hover:text-blue-600" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                  SybauEducation
                </span>
              </Link>
            </div>
            <p className="text-center text-muted-foreground max-w-sm text-sm leading-relaxed">
              Empowering learners worldwide with premium educational content and
              innovative learning experiences.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="group relative px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 ease-in-out rounded-lg hover:bg-primary/5 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {link.name}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 group-hover:w-6" />
              </Link>
            ))}
          </nav>

          {/* Social Media Icons */}
          <div className="flex items-center space-x-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <button
                  key={social.name}
                  className={`group inline-flex items-center justify-center w-10 h-10 rounded-lg text-muted-foreground transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${social.color}`}
                  onClick={() => window.open(social.href, "_blank")}
                  aria-label={social.name}
                >
                  <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                </button>
              );
            })}
          </div>

          {/* Decorative Divider */}
          <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Copyright */}
          <div className="text-center text-sm text-muted-foreground flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-muted/20 to-primary/5 backdrop-blur-sm">
            <span>© 2025 SybauEducation. Stay Young, Beautiful And Unique</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
