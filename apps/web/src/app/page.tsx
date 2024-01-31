"use client";

import UnlockPower from "@/app/ui/sections/UnlockPower";
import DFIOpportunities from "@/app/ui/sections/DFIOpportunities";
export default function Page() {
  return (
    <div className="flex justify-center flex-col items-center w-full my-12 md:my-24">
      <UnlockPower />
      <DFIOpportunities />
    </div>
  );
}
