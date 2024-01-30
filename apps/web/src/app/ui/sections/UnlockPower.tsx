import { SectionTitle } from "@/app/ui/components/SectionTitle";
import { SectionDescription } from "@/app/ui/components/SectionDescription";
import { CTAButton } from "@/app/ui/components/CTAButton";
import { SecondaryButton } from "@/app/ui/components/SecondaryButton";

export default function UnlockPower() {
  return (
    <div className="w-full flex flex-col items-center justify-center text-light-00 gap-16">
      <div className="grid gap-6">
        <SectionTitle
          text="Unlock the power of your assets"
          testID="unlock-power"
        />
        <SectionDescription
          text="Maximize your capital efficiency. Earn rewards without the hassle of managing your own Masternode."
          testID="maximize"
        />
      </div>
      <div className="flex items-center gap-6">
        <CTAButton text="Launch app" testID="launch-app" />
        <SecondaryButton text="Learn more" testID="learn-more" />
      </div>
    </div>
  );
}
