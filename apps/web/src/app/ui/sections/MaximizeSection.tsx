import { SectionTitle } from "@/app/ui/components/SectionTitle";
import { SectionDescription } from "@/app/ui/components/SectionDescription";
import { CTAButton } from "@/app/ui/components/CTAButton";
import { CTAButtonOutline } from "@/app/ui/components/CTAButtonOutline";

export default function MaximizeSection() {
  return (
    <div className="w-full flex flex-col items-center justify-center text-light-00 gap-16">
      <div className="grid gap-6">
        <SectionTitle
          text="Maximize your DFI capital efficiency"
          testID="maximize"
          customStyle=""
        />
        <SectionDescription
          text="DFI Masternodes rewards made simple. Earn rewards without the hassle of managing your own Masternode."
          testID="maximize"
        />
      </div>
      <div className="flex items-center gap-6">
        <CTAButton
          text="Launch App"
          testID="launch-app"
          customTextStyle="text-dark-00"
        />
        <CTAButtonOutline text="Learn more" testID="learn-more" />
      </div>
    </div>
  );
}
