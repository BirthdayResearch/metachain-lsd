"use client";

import React, { useRef } from "react";
import AppHeader from "@/app/app/components/AppHeader";
import AppFooter from "@/app/app/components/AppFooter";
import AppProviders from "@/provider/AppProviders";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <AppProviders>
      <div
        ref={contentRef}
        className="flex w-full min-h-screen flex-col items-center text-light-1000"
      >
        <AppHeader />
        <div className="w-full flex-grow">{children}</div>
        <AppFooter />
      </div>
    </AppProviders>
  );
}
