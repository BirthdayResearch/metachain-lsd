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

export default function LandingPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={contentRef} className="pb-8 text-light-1000 relative">
      <Header parentReference={contentRef} />
      <div className="flex flex-col justify-center items-center my-12 md:my-24 gap-y-24 md:gap-y-60 max-w-5xl mx-auto w-full px-5 md:px-0">
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
