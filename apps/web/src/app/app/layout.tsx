"use client";

import React from "react";

import AppLayout from "@/app/app/components/AppLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout>
      <section className="mx-5 md:mx-12">{children}</section>
    </AppLayout>
  );
}
