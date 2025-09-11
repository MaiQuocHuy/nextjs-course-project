"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, CreditCard, List, Star, Award, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigationItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "My Courses",
    href: "/dashboard/my-courses",
    icon: BookOpen,
  },
  {
    label: "Certificates",
    href: "/dashboard/certificates",
    icon: Award,
  },
  {
    label: "Payments",
    href: "/dashboard/payments",
    icon: CreditCard,
  },
  {
    label: "Quiz Results",
    href: "/dashboard/quiz-results",
    icon: List,
  },
  {
    label: "Reviews",
    href: "/dashboard/reviews",
    icon: Star,
  },
  {
    label: "Affiliate Payouts",
    href: "/dashboard/affiliate-payout",
    icon: CreditCard,
  },
  {
    label: "Discount Usage",
    href: "/dashboard/discount-usage",
    icon: CreditCard,
  },
];

interface SidebarProps {
  className?: string;
}

function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-primary">Student Portal</h2>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("hidden lg:block", className)}>
      <div className="flex h-full w-64 flex-col fixed inset-y-0 z-50 bg-background border-r">
        <SidebarContent />
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden size-10">
          <Menu className="h-8 w-8 size-10" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>
        <SidebarContent onItemClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
