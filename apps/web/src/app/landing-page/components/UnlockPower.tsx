import { SectionTitle } from "@/components/SectionTitle";
import { SectionDescription } from "@/components/SectionDescription";
import { SecondaryButton } from "@/components/SecondaryButton";
import SectionContainer from "@/components/SectionContainer";
import { CTAButton } from "@/components/button/CTAButton";
import { Tag } from "@/components/Tag";

export default function UnlockPower() {
  return (
    <SectionContainer customContainerStyle="flex-col gap-y-16 md:max-w-3xl">
      <>
        <div className="gap-y-5 md:gap-6 flex flex-col items-center justify-center">
          <Tag text="BETA RELEASE" testID="beta-release" />
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
            href="/app/stake"
            label="Launch app"
            testID="launch-app"
            customStyle="md:w-fit w-full"
          />
          <SecondaryButton
            text="Learn more"
            testID="learn-more"
            customStyle="md:w-fit w-full"
            href="https://marblefi.gitbook.io"
          />
        </div>
      </>
    </SectionContainer>
  );
}
