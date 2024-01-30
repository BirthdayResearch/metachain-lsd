import UnlockPower from "@/app/ui/sections/UnlockPower";
import HowItWorksSection from "@/app/ui/sections/HowItWorksSection";

export default function Base() {
  return (
    <div className="font-mono flex flex-col justify-center items-center w-full m-20 mb-30">
      <UnlockPower />
      <HowItWorksSection />
    </div>
  );
}
