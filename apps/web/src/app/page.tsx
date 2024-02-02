"use client";

import UnlockPower from "@/app/ui/sections/UnlockPower";
import PartnersSection from "@/app/ui/sections/PartnersSection";
import DFIOpportunities from "@/app/ui/sections/DFIOpportunities";
export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center w-full my-12 md:my-24 gap-y-24 md:gap-y-60">
      <UnlockPower />
      <DFIOpportunities />
      <PartnersSection />
    </div>
  );
}
