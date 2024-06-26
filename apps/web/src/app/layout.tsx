import type { Metadata } from "next";
import "../globals.css";
import ContainerLayout from "@/components/ContainerLayout";
import React from "react";

export const metadata: Metadata = {
  title: "MarbleFI",
  description:
    "MarbleFi is a Liquid Staking Derivative product by Birthday Research on DeFiChain.",
  openGraph: {},
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ContainerLayout>{children}</ContainerLayout>;
}
