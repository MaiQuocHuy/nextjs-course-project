"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  X,
  GraduationCap,
  User,
  LogIn,
  UserPlus,
  Settings,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  VisuallyHidden,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchBar } from "@/components/common/SearchBar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, useAuthStatus } from "@/hooks/useAuth";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "../ui/avatar";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Certificate", href: "/certificates" },
];

export function Header() {
  const { logout: authLogout, user } = useAuth();
  const { isAuthenticated: isLoggedIn, isReady } = useAuthStatus();

  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const userRole = user?.role;

  // Show loading skeleton while auth state is being determined
  if (!isReady) {
    return (
      <header className="flex justify-center sticky top-0 z-50 w-full border-b backdrop-blur-xl bg-white/80 dark:bg-black/80 shadow-lg shadow-black/5 dark:shadow-white/5">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              SybauEducation
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  const userName = user?.name || "";
  const userEmail = user?.email || "";
  const userThumbnail = user?.thumbnailUrl || "";

  const handleLogout = async () => {
    try {
      await authLogout("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Force redirect if logout fails
      router.push("/login");
    }
  };

  const isActiveLink = (href: string) => {
    return pathname === href;
  };

  const NavLink = ({
    href,
    children,
    mobile = false,
  }: {
    href: string;
    children: React.ReactNode;
    mobile?: boolean;
  }) => (
    <Link
      href={href}
      className={cn(
        "relative transition-all duration-300 ease-in-out rounded-lg font-medium",
        mobile
          ? "block px-4 py-3 text-base hover:bg-primary/10 hover:text-primary hover:shadow-sm"
          : "px-4 py-2 hover:bg-primary/10 hover:text-primary hover:shadow-md hover:-translate-y-0.5",
        isActiveLink(href)
          ? "text-primary bg-primary/5 shadow-sm" +
              (mobile
                ? ""
                : " after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-6 after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-purple-500 after:rounded-full after:shadow-lg")
          : "text-foreground/80 hover:text-primary"
      )}
      onClick={() => mobile && setIsOpen(false)}
    >
      {children}
    </Link>
  );

  return (
    <header className="flex justify-center sticky top-0 z-50 w-full border-b backdrop-blur-xl bg-white/80 dark:bg-black/80 shadow-lg shadow-black/5 dark:shadow-white/5">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
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

        {/* Desktop Navigation & Search */}
        <div className="hidden lg:flex items-center space-x-8">
          <nav className="flex items-center space-x-1">
            {navigation.map((item) => (
              <NavLink key={item.name} href={item.href}>
                {item.name}
              </NavLink>
            ))}
          </nav>

          <SearchBar className="w-80 transition-all duration-300 focus-within:scale-105 focus-within:shadow-lg relative z-[100]" />
        </div>

        {/* Right side - Desktop */}
        <div className="hidden md:flex items-center space-x-3">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-primary border border-primary/30 bg-primary/5 hover:bg-primary hover:text-primary-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-primary/25 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  <Avatar>
                    <AvatarImage
                      className="h-7 w-7 rounded-full"
                      src={userThumbnail || "/placeholder.svg"}
                      alt={`${userName} avatar`}
                    />
                    <AvatarFallback className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                      {userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{userName}</span>
                  <ChevronDown className="h-4 w-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 mt-2 bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-border/50 shadow-xl"
              >
                <DropdownMenuLabel className="flex items-center gap-2 py-3">
                  <Avatar>
                    <AvatarImage
                      className="h-7 w-7 rounded-full"
                      src={userThumbnail || "/placeholder.svg"}
                      alt={`${userName} avatar`}
                    />
                    <AvatarFallback className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                      {userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{userName}</span>
                    <span className="text-sm text-muted-foreground">{userEmail}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 cursor-pointer transition-colors hover:bg-primary/10"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`${userRole === "STUDENT" ? "/dashboard" : "/instructor"}`}
                    className="flex items-center gap-2 cursor-pointer transition-colors hover:bg-primary/10"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 cursor-pointer transition-colors hover:bg-primary/10"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/login"
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-primary border-primary/30 bg-primary/5 hover:bg-primary hover:text-primary-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-primary/25 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <LogIn className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                Login
              </Link>
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                <UserPlus className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center space-x-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="transition-all duration-300 hover:bg-primary/10 hover:scale-105 hover:rotate-3 focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {isOpen ? (
                  <X className="h-6 w-6 transition-transform duration-300" />
                ) : (
                  <Menu className="h-6 w-6 transition-transform duration-300" />
                )}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[320px] p-0 bg-background border-l border-border/50 shadow-2xl"
            >
              <VisuallyHidden.Root>
                <SheetTitle>Navigation Menu</SheetTitle>
              </VisuallyHidden.Root>
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="p-6 border-b border-border/50 bg-background">
                  <Link
                    href="/"
                    className="group flex items-center space-x-2 transition-all duration-300 hover:scale-105"
                    onClick={() => setIsOpen(false)}
                  >
                    <GraduationCap className="h-6 w-6 text-primary transition-transform duration-300 group-hover:rotate-12" />
                    <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      EduPlatform
                    </span>
                  </Link>
                </div>

                {/* Mobile Search */}
                <div className="p-6 border-b border-border/50 relative z-[100]">
                  <SearchBar
                    className="transition-all duration-300 focus-within:scale-105"
                    placeholder="Search courses..."
                  />
                </div>

                {/* Mobile Navigation */}
                <div className="flex-1 p-6">
                  <nav className="flex flex-col space-y-1">
                    {navigation.map((item) => (
                      <div key={item.name}>
                        <NavLink href={item.href} mobile>
                          {item.name}
                        </NavLink>
                      </div>
                    ))}
                  </nav>
                </div>

                {/* Mobile Auth Buttons */}
                <div className="p-6 border-t border-border/50 bg-background">
                  {isLoggedIn ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-lg">
                        <Avatar>
                          <AvatarImage
                            className="h-7 w-7 rounded-full"
                            src={userThumbnail || "/placeholder.svg"}
                            alt={`${userName} avatar`}
                          />
                          <AvatarFallback className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                            {userName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{userName}</span>
                          <span className="text-sm text-muted-foreground">{userEmail}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/10 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          Profile
                        </Link>
                        <Link
                          href={`${userRole === "STUDENT" ? "/dashboard" : "/instructor"}`}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/10 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/10 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsOpen(false);
                          }}
                          className="flex items-center gap-2 p-2 w-full text-left rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Log out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-3">
                      <Button
                        asChild
                        variant="ghost"
                        className="w-full flex items-center gap-2 transition-all duration-300 hover:bg-primary/10 hover:scale-105 hover:shadow-md"
                      >
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          <LogIn className="h-4 w-4" />
                          Login
                        </Link>
                      </Button>
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                      >
                        <Link href="/register" onClick={() => setIsOpen(false)}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Register
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
