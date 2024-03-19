"use client";

import { Provider } from "react-redux";
import UnlockPower from "@/app/ui/sections/UnlockPower";
import HowItWorksSection from "@/app/ui/sections/HowItWorksSection";
import MarbleOpportunitiesSection from "@/app/ui/sections/MarbleOpportunitiesSection";
import JoinTheCommunitySection from "@/app/ui/sections/JoinTheCommunitySection";
import FaqSection from "@/app/ui/sections/FaqSection";
import DFIOpportunities from "@/app/ui/sections/DFIOpportunities";
import { store } from "@/app/store/store";

export default function Page() {
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
