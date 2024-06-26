"use client";

import type { Metadata } from "next";
import "../globals.css";
import { Montserrat } from "next/font/google";
import { Next13ProgressBar } from "next13-progressbar";
import React, { useRef, useState, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import Head from "next/head";

const inter = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MarbleFI",
  description:
    "MarbleFi is a Liquid Staking Derivative product by Birthday Research on DeFiChain.",
  openGraph: {},
};

export default function ContainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const appName = "marblefi.xyz/app/stake";
  const shortDescription =
    "MarbleFi is a Liquid Staking Derivative product by Birthday Research on DeFiChain.";
  const longDescription =
    "MarbleFi was conceptualized to help users in DeFiChain to unlock the power of their assets and earn DFI rewards without the need to manage their own Masternodes.";
  const siteTitle = "MarbleFi - Liquid Staking Derivatives";
  const website = "https://marblefi.xyz/";
  const keywords =
    "LSD, Liquid Staking, Restaking, Staked Assets, LST, Liquid Staked Tokens, DeFiChain, DeFiChain EVM, DeFiMetaChain, EVM, Smart Contracts, ERC20 Staking";

  const contentRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en">
      <Head>
        <base href="/" />
        <meta name="application-name" content={appName} />
        <meta charSet="UTF-8" />
        <title key="title">{siteTitle}</title>
        <meta key="description" name="description" content={longDescription} />
        <meta key="keywords" name="keywords" content={keywords} />
        <meta key="robots" name="robots" content="follow,index" />
        <meta name="googlebot" content="index,follow" />
        <meta name="google" content="notranslate" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, shrink-to-fit=no, viewport-fit=cover"
        />
        <meta
          key="apple-mobile-web-app-capable"
          name="apple-mobile-web-app-capable"
          content="yes"
        />
        <meta name="theme-color" content="#5B10FF" />

        <meta name="og:locale" content="en_SG" />
        <meta name="og:title" content={siteTitle} />
        <meta name="og:image" content="/marblefi_share.png" />
        <meta name="og:site_name" content={appName} />
        <meta name="og:url" content={website} />
        <meta name="og:description" content={shortDescription} />

        <meta name="twitter:card" content={shortDescription} />
        <meta name="twitter:site" content={website} />
        <meta name="twitter:creator" content="@birthdaydev" />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={shortDescription} />
        <meta
          name="twitter:image"
          content="https://marblefi.xyz/marblefi_share.png"
        />
        <meta name="twitter:image:alt" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <body
        suppressHydrationWarning={true}
        className={`${inter.className} absolute top-0 left-0 z-auto h-full w-full bg-cover bg-no-repeat bg-clip-border bg-[url('/background-mobile-375.svg')] md:bg-[url('/background-web-1440.svg')]`}
      >
        <Provider store={store}>
          {mounted && (
            <div
              ref={contentRef}
              className="flex min-h-screen flex-col items-center w-full text-light-1000"
            >
              {children}
              <Next13ProgressBar
                height="4px"
                color="#69FF23"
                options={{ showSpinner: true }}
                showOnShallow
              />
            </div>
          )}
        </Provider>
      </body>
    </html>
  );
}
