"use client";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactNode } from "react";
import StoreProvider from "@/components/providers/StoreProvider";
import { NextAuthProvider } from "@/components/providers/AuthProvider";

export function SystemProvider({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <NextAuthProvider>
        <TooltipProvider>
          <Toaster position="top-right" richColors />
          {children}
        </TooltipProvider>
      </NextAuthProvider>
    </StoreProvider>
  );
}
