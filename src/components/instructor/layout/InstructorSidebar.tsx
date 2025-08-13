import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  DollarSign,
  Bell,
  MessageSquare,
  Mail,
  Settings,
  LogOut,
  GraduationCap,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface InstructorSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
}

const navigation = [
  { name: 'Dashboard', href: '/instructor', icon: LayoutDashboard },
  { name: 'Courses', href: '/instructor/courses', icon: BookOpen },
  { name: 'Students', href: '/instructor/students', icon: Users },
  { name: 'Messages', href: '/instructor/messages', icon: MessageSquare },
  { name: 'Email', href: '/instructor/email', icon: Mail },
  { name: 'Earnings', href: '/instructor/earnings', icon: DollarSign },
  { name: 'Notifications', href: '/instructor/notifications', icon: Bell },
];

const SidebarContent = ({ isLoading }: { isLoading: boolean }) => {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-sidebar-primary">
      {/* Logo */}
      <Link
        href="/instructor"
        className={`flex h-16 items-center px-6 & ${
          isLoading && 'pointer-events-none'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-white/20 p-2">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Sybau</h1>
            <p className="text-xs text-white/80">Instructor Panel</p>
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
                className={`${isLoading && 'pointer-events-none'}`}
              >
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start h-11 px-4 text-white/80 cursor-pointer hover:text-white hover:bg-white/10',
                    isActive && 'bg-white/20 text-white font-medium'
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

      {/* Bottom section */}
      <div className="p-4 space-y-2">
        <Button
          disabled={isLoading}
          variant="ghost"
          className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
        >
          <Settings className="mr-3 h-4 w-4" />
          Settings
        </Button>
        <Button
          disabled={isLoading}
          variant="ghost"
          className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </Button>
      </div>
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
