"use client";

import UnlockPower from "@/app/ui/sections/UnlockPower";
import HowItWorksSection from "@/app/ui/sections/HowItWorksSection";
import MarbleOpportunitiesSection from "@/app/ui/sections/MarbleOpportunitiesSection";
import JoinTheCommunitySection from "@/app/ui/sections/JoinTheCommunitySection";
export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center w-full my-12 md:my-24 gap-[96px] md:gap-[240px]">
      <UnlockPower />
      <MarbleOpportunitiesSection />
      <HowItWorksSection />
      <JoinTheCommunitySection />
    </div>
  );
}
