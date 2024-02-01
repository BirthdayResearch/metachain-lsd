import { CTAButton } from "@/app/ui/components/CTAButton";
import SectionContainer from "@/app/ui/components/SectionContainer";
import Image from "next/image";

export default function DFIOpportunities() {
  return (
    <SectionContainer>
      <div className="w-full flex flex-col md:flex-row md:gap-x-10 gap-y-12 items-center justify-center">
        <div className="flex-1">
          <h2 className="h2-text text-light-1000 mb-4">
            Take advantage of mDFI for new opportunities
          </h2>
          <p className="body-1-regular-text text-light-1000 mb-6">
            Uniquely designed for liquid staking, mDFI can be used to various
            DeFi applications such as staking to stability pools, governance
            protocols, and securing the blockchain.
          </p>
          <CTAButton text="Launch app" testID="launch-app" customStyle="w-full md:w-fit" />
        </div>
        <div className="flex-1 flex flex-col md:flex-row gap-y-8 md:w-full md:gap-x-6 w-full">
          <Image
            data-testid="mdfi-logo"
            src="/mDFI.svg"
            alt="mDFI Logo"
            width={224}
            height={224}
          />
          <div className="flex flex-col justify-between gap-x-6 gap-y-2 w-full">
            <div className="details-container-ui px-6 py-4 flex flex-row justify-between items-center">
              <span className="body-2-regular-text">Market Cap</span>
              <h4 className="h4-text">$1.32M</h4>
            </div>
            <div className="details-container-ui px-6 py-4 flex flex-row justify-between items-center">
              <span className="body-2-regular-text">Market Cap</span>
              <h4 className="h4-text">$1.32M</h4>
            </div>
            <div className="details-container-ui px-6 py-4 flex flex-row justify-between items-center">
              <span className="body-2-regular-text">Market Cap</span>
              <h4 className="h4-text">$1.32M</h4>
            </div>

          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
