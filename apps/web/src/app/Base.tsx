import MaximizeSection from "@/app/ui/sections/MaximizeSection";
import HowItWorksSection from "@/app/ui/sections/HowItWorksSection";

export default function Base() {
  return (
    <div className="flex flex-col justify-center items-center w-full m-20 mb-30">
      <MaximizeSection />
      <HowItWorksSection />
    </div>
  );
}
