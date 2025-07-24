"use client";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { ReactNode } from "react";

export function SystemProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <TooltipProvider>
        <Toaster />
        {children}
      </TooltipProvider>
    </Provider>
  );
}
