import { CTAButton } from "@/app/ui/components/CTAButton";
import SectionContainer from "@/app/ui/components/SectionContainer";
import Image from "next/image";
import useResponsive from "@/app/lib/hooks/useResponsive";
import clsx from "clsx";

export default function DFIOpportunities() {
  const { isLg } = useResponsive();
  return (
    <SectionContainer>
      <div className="flex flex-col md:flex-row md:gap-x-10 gap-y-12 items-center justify-center w-full">
        <div className="max-w-[520px]">
          <h1 className="text-[28px] leading-[40px] md:leading-[56px] md:text-[40px] text-light-1000 font-semibold mb-4">
            Take advantage of mDFI for new opportunities
          </h1>
          <p className="body-1-regular-text text-light-1000 mb-6">
            Uniquely designed for liquid staking, mDFI can be used to various
            DeFi applications such as staking to stability pools, governance
            protocols, and securing the blockchain.
          </p>
          <CTAButton
            text="Launch app"
            testID="launch-app"
            customStyle="w-full md:w-fit"
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-y-8 md:gap-x-6 w-full">
          <Image
            data-testid="mdfi-logo"
            src="/mDFI.svg"
            alt="mDFI Logo"
            width={224}
            height={224}
            className={clsx("w-fit", isLg ? "h-[224px]" : "h-[168px]")}
          />
          <div className="flex flex-col justify-between gap-x-6 gap-y-2 w-full">
            <div className="details-container-ui px-6 py-4 flex flex-row justify-between items-center">
              <span className="body-2-regular-text flex-1">Market Cap</span>
              <h4 className="h4-text flex-1 text-end">$X.XX</h4>
            </div>
            <div className="details-container-ui px-6 py-4 flex flex-row justify-between items-center">
              <span className="body-2-regular-text flex-1">Price</span>
              <h4 className="h4-text w-full text-end">X.XX DFI</h4>
            </div>
            <div className="details-container-ui px-6 py-4 flex flex-row justify-between items-center">
              <span className="body-2-regular-text flex-1">
                Total value locked
              </span>
              <h4 className="h4-text flex-1 text-end">$X.XX</h4>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
