"use client";

import React from "react";

import AppLayout from "@/app/app/components/AppLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout>
      <section className="md:mx-12 md:pb-16">{children}</section>
    </AppLayout>
  );
}
