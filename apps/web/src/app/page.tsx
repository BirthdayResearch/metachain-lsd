"use client";

import UnlockPower from "@/app/ui/sections/UnlockPower";
import HowItWorksSection from "@/app/ui/sections/HowItWorksSection";
import MarbleOpportunitiesSection from "@/app/ui/sections/MarbleOpportunitiesSection";
export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center w-full my-12 md:my-24">
      <UnlockPower />
      <MarbleOpportunitiesSection />
      <HowItWorksSection />
    </div>
  );
}
