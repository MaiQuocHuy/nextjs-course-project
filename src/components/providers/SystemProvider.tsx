"use client";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Provider } from "react-redux";
import { ReactNode } from "react";
import StoreProvider from "@/components/providers/StoreProvider";

export function SystemProvider({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <TooltipProvider>
        <Toaster />
        {children}
      </TooltipProvider>
    </StoreProvider>
  );
}
