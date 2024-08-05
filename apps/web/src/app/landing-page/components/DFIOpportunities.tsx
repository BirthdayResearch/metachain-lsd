import SectionContainer from "@/components/SectionContainer";
import Image from "next/image";
import { CTAButton } from "@/components/button/CTAButton";
import clsx from "clsx";
import { useGetStatsQuery } from "@/store/marbleFiApi";
import { getDecimalPlace } from "@/lib/textHelper";
import NumericFormat from "@/components/NumericFormat";
import { formatNumberWithSuffix } from "@/lib/formatNumberWithSuffix";
import BigNumber from "bignumber.js";
import { useMemo } from "react";
import { useDfiPrice } from "@/hooks/useDfiPrice";
import { useNetworkEnvironmentContext } from "@/context/NetworkEnvironmentContext";

export default function DFIOpportunities() {
  const { networkEnv } = useNetworkEnvironmentContext();
  const { data } = useGetStatsQuery({ network: networkEnv });
  const dfiPriceUsdValue = useDfiPrice();

  // Retrieve API data and calculate and format market cap and TVL
  const statValues = useMemo(() => {
    if (!data) {
      return {
        tvl: "0",
        mdfiToDfiRatio: "0",
      };
    }
    // TVL (price of DFI * mDFI ratio * number of mDFI circulating)
    const tvl = new BigNumber(data.mDfiDfiRatio)
      .multipliedBy(dfiPriceUsdValue)
      .multipliedBy(new BigNumber(data.totalAssets));
    return {
      tvl: formatNumberWithSuffix(tvl.toNumber()),
      mdfiToDfiRatio: data.mDfiDfiRatio,
    };
  }, [data, dfiPriceUsdValue]);

  const { tvl, mdfiToDfiRatio } = statValues;

  return (
    <SectionContainer id="about-section">
      <div className="w-full flex flex-col md:flex-row md:gap-x-10 gap-y-12 items-center justify-center scroll-mt-40">
        <div className="max-w-[520px]">
          <h1 className="text-[28px] leading-10 md:leading-[56px] md:text-[40px] text-light-1000 font-semibold mb-4">
            Take advantage of mDFI for new opportunities
          </h1>
          <p className="body-1-regular-text text-light-1000 mb-6">
            Uniquely designed for liquid staking, mDFI can be used to various
            DeFi applications such as staking to stability pools, governance
            protocols, and securing the blockchain.
          </p>
          <CTAButton
            href="/app/stake"
            label="Launch app"
            testId="launch-app"
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
            className={clsx("w-[168px] h-[168px] lg:w-[224px] lg:h-[224px]")}
            loading="lazy"
          />
          <div className="flex flex-col justify-center gap-x-6 gap-y-2 w-full">
            <div className="details-container-ui px-6 py-4 flex flex-row justify-between items-center">
              <span className="body-2-regular-text flex-1">Price</span>
              <NumericFormat
                className="h4-text flex-1 text-end"
                value={mdfiToDfiRatio}
                suffix=" DFI"
                decimalScale={getDecimalPlace(mdfiToDfiRatio)}
                trimTrailingZeros={false}
              />
            </div>
            <div className="details-container-ui px-6 py-4 flex flex-row justify-between items-center">
              <span className="body-2-regular-text flex-1">
                Total value locked
              </span>
              <h4 className="h4-text flex-1 text-end">${tvl}</h4>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
