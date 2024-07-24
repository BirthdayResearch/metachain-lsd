import type { Metadata } from "next";
import "../globals.css";
import ContainerLayout from "@/components/ContainerLayout";
import React from "react";
import AppProviders from "@/provider/AppProviders";

const appName = "marblefi.xyz/app/stake";
const shortDescription =
  "MarbleFi is a Liquid Staking Derivative product by Birthday Research on DeFiChain.";
const longDescription =
  "MarbleFi was conceptualized to help users in DeFiChain to unlock the power of their assets and earn DFI rewards without the need to manage their own Masternodes.";
const siteTitle = "MarbleFi - Liquid Staking Derivatives";
const website = "https://marblefi.xyz/";
const keywords =
  "LSD, Liquid Staking, Restaking, Staked Assets, LST, Liquid Staked Tokens, DeFiChain, DeFiChain EVM, DeFiMetaChain, EVM, Smart Contracts, ERC20 Staking";

export const metadata: Metadata = {
  title: "MarbleFI",
  description: longDescription,
  keywords,
  applicationName: appName,
  openGraph: {
    description: shortDescription,
    images: ["https://marblefi.xyz/marblefi_share.png"],
    title: "MarbleFi",
    siteName: siteTitle,
    locale: "en_SG",
    url: website,
  },
  twitter: {
    site: siteTitle,
    creator: "@birthdaydev",
    title: "MarbleFI",
    description: shortDescription,
    images: ["https://marblefi.xyz/marblefi_share.png"],
  },

  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProviders>
      <ContainerLayout>{children}</ContainerLayout>
    </AppProviders>
  );
}
