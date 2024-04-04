"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import DFIOpportunities from "@/app/landing-page/components/DFIOpportunities";
import UnlockPower from "./landing-page/components/UnlockPower";
import MarbleOpportunitiesSection from "./landing-page/components/MarbleOpportunitiesSection";
import HowItWorksSection from "./landing-page/components/HowItWorksSection";
import JoinTheCommunitySection from "./landing-page/components/JoinTheCommunitySection";
import FaqSection from "./landing-page/components/FaqSection";

export default function LandingPage() {
  return (
    <Provider store={store}>
      <div className="flex flex-col justify-center items-center w-full my-12 md:my-24 gap-y-24 md:gap-y-60">
        <UnlockPower />
        <MarbleOpportunitiesSection />
        <HowItWorksSection />
        <DFIOpportunities />
        <JoinTheCommunitySection />
        <FaqSection />
      </div>
    </Provider>
  );
}
