"use client";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Provider } from "react-redux";
import { ReactNode } from "react";
import StoreProvider from "@/components/providers/StoreProvider";
import { NextAuthProvider } from "@/components/providers/AuthProvider";

export function SystemProvider({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <NextAuthProvider>
        <TooltipProvider>
          <Toaster />
          {children}
        </TooltipProvider>
      </NextAuthProvider>
    </StoreProvider>
  );
}
