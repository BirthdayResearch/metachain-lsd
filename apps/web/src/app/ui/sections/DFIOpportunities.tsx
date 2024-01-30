import { CTAButton } from "@/app/ui/components/CTAButton";
import SectionContainer from "@/app/ui/components/SectionContainer";
import Image from "next/image";

export default function DFIOpportunities() {
  return (
    <SectionContainer customContainerStyle="flex-row gap-x-10">
      <>
        <div className="flex-1">
          <h1 className="h1-text text-light-1000 mb-4">
            Take advantage of mDFI for new opportunities
          </h1>
          <p className="body-1-regular-text text-light-1000 mb-6">
            Uniquely designed for liquid staking, mDFI can be used to various
            DeFi applications such as staking to stability pools, governance
            protocols, and securing the blockchain.
          </p>
          <CTAButton text="Launch app" testID="launch-app" />
        </div>
        <div className="flex-1 flex flex-row gap-x-8">
          <Image
            data-testid="mdfi-logo"
            src="/mDFI.svg"
            alt="mDFI Logo"
            width={224}
            height={224}
          />
          <div className="flex flex-col justify-between">
            <div className="">Market Cap</div>
            <div>Market Cap</div>
            <div>Market Cap</div>
          </div>
        </div>
      </>
    </SectionContainer>
  );
}
