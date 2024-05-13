"use client";

import React from "react";

import AppLayout from "@/app/app/components/AppLayout";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout>
      <Toaster containerClassName="!top-[5.5rem] md:!top-36" />
      <section className="md:mx-12 md:pb-16">{children}</section>
    </AppLayout>
  );
}
