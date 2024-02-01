import { SectionTitle } from "@/app/ui/components/SectionTitle";
import { SectionDescription } from "@/app/ui/components/SectionDescription";
import { CTAButton } from "@/app/ui/components/CTAButton";
import { SecondaryButton } from "@/app/ui/components/SecondaryButton";
import Tag from "@/app/ui/components/Tag";
import SectionContainer from "@/app/ui/components/SectionContainer";

export default function UnlockPower() {
  return (
    <SectionContainer customContainerStyle="flex-col py-0">
      <>
        <div className="gap-y-5 md:gap-6 flex flex-col items-center justify-center">
          <Tag />
          <SectionTitle
            text="Unlock the power of your assets"
            testID="unlock-power"
          />
          <SectionDescription
            text="Maximize your capital efficiency. Earn rewards without the hassle of managing your own Masternode."
            testID="maximize"
          />
        </div>
        <div className="flex flex-col pt-12 md:pt-0 md:flex-row items-center gap-6 w-full md:w-fit">
          <CTAButton
            text="Launch app"
            testID="launch-app"
            customStyle="md:w-fit w-full"
          />
          <SecondaryButton
            text="Learn more"
            testID="learn-more"
            customStyle="md:w-fit w-full"
          />
        </div>
      </>
    </SectionContainer>
  );
}
