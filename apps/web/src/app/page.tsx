"use client";

import UnlockPower from "@/app/ui/sections/UnlockPower";
import PartnersSection from "@/app/ui/sections/PartnersSection";
import DFIOpportunities from "@/app/ui/sections/DFIOpportunities";
export default function Page() {
  return (
    <div className="flex justify-center flex-col items-center w-full gap-y-24 md:gap-y-60 my-12 md:my-24">
      <UnlockPower />
      <DFIOpportunities />
      <PartnersSection />
    </div>
  );
}
