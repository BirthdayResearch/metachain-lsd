import type { Metadata } from "next";
import "../globals.css";
import ContainerLayout from "@/components/ContainerLayout";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ContainerLayout>{children}</ContainerLayout>;
}
