import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  DollarSign,
  Bell,
  Settings,
  LogOut,
  GraduationCap,
  RefreshCw,
  Award,
  Coins,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface InstructorSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
}

const navigation = [
  { name: "Dashboard", href: "/instructor", icon: LayoutDashboard },
  { name: "Courses", href: "/instructor/courses", icon: BookOpen },
  { name: "Students", href: "/instructor/students", icon: Users },
  { name: "Certificates", href: "/instructor/certificates", icon: Award },
  { name: "Earnings", href: "/instructor/earnings", icon: DollarSign },
  { name: "Refunds", href: "/instructor/refunds", icon: RefreshCw },
  {
    name: "Affiliate Payouts",
    href: "/instructor/affiliate-payout",
    icon: Coins,
  },
  { name: "Discount Usage", href: "/instructor/discount-usage", icon: Tag },
  { name: "Notifications", href: "/instructor/notifications", icon: Bell },
];

const SidebarContent = ({ isLoading }: { isLoading: boolean }) => {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-background border-r">
      {/* Logo */}
      <Link
        href="/instructor"
        className={`flex h-16 items-center px-6 & ${
          isLoading && "pointer-events-none"
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-white/20 p-2">
            <GraduationCap className="h-6 w-6 " />
          </div>
          <div>
            <h1 className="text-lg font-semibold ">Sybau</h1>
            <p className="text-xs /80">Instructor Panel</p>
          </div>
        </div>
      </Link>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4">
        <nav className="space-y-2 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${isLoading && "pointer-events-none"}`}
              >
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-11 px-4 /80 cursor-pointer text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
};

export const InstructorSidebar = ({
  open,
  onOpenChange,
  isLoading,
}: InstructorSidebarProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <SidebarContent isLoading={isLoading} />
      </div>

      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="p-0 w-72">
          <SidebarContent isLoading={isLoading} />
        </SheetContent>
      </Sheet>
    </>
  );
};
