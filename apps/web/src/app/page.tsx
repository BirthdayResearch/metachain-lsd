"use client";

import UnlockPower from "@/app/ui/sections/UnlockPower";
import HowItWorksSection from "@/app/ui/sections/HowItWorksSection";
export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center w-full my-12 md:my-24 gap-y-24 md:gap-y-60">
      <UnlockPower />
      <HowItWorksSection />
    </div>
  );
}
