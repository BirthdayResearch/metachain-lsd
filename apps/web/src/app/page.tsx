"use client";

import DFIOpportunities from "@/app/landing-page/components/DFIOpportunities";
import UnlockPower from "./landing-page/components/UnlockPower";
import MarbleOpportunitiesSection from "./landing-page/components/MarbleOpportunitiesSection";
import HowItWorksSection from "./landing-page/components/HowItWorksSection";
import JoinTheCommunitySection from "./landing-page/components/JoinTheCommunitySection";
import FaqSection from "./landing-page/components/FaqSection";
import Header from "@/components/Header";
import React, { useRef } from "react";
import Footer from "@/components/Footer";
import Head from "next/head";

export default function LandingPage() {
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

  return (
    <div ref={contentRef} className="pb-8 text-light-1000 relative">
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
        <meta name="og:image" content="/marblefi_share.jpg" />
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
          content="https://marblefi.xyz/marblefi_share.jpg"
        />
        <meta name="twitter:image:alt" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <Header parentReference={contentRef} />
      <div className="flex flex-col justify-center items-center my-12 md:my-24 gap-y-24 md:gap-y-60 max-w-5xl mx-auto w-full px-5 md:px-12">
        <UnlockPower />
        <MarbleOpportunitiesSection />
        <HowItWorksSection />
        <DFIOpportunities />
        <JoinTheCommunitySection />
        <FaqSection />
      </div>
      <Footer parentReference={contentRef} />
    </div>
  );
}
