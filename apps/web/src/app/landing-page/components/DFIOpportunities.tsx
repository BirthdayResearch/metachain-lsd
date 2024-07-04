import SectionContainer from "@/components/SectionContainer";
import Image from "next/image";
import { CTAButton } from "@/components/button/CTAButton";
import clsx from "clsx";
import { useGetStatsQuery } from "@/store/marbleFiApi";
import { useGetReadContractConfigs } from "@/hooks/useGetReadContractConfigs";
import { getDecimalPlace } from "@/lib/textHelper";
import NumericFormat from "@/components/NumericFormat";
import { formatNumberWithSuffix } from "@/lib/formatNumberWithSuffix";
import BigNumber from "bignumber.js";
import { useWhaleApiClient } from "@/context/WhaleProvider";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function DFIOpportunities() {
  const { data } = useGetStatsQuery();
  const { usd: dfiPriceUsd } = useSelector(
    (state: RootState) => state.stats.price,
  );
  const dfiPriceUsdValue = dfiPriceUsd ?? "0";

  const marketCap: BigNumber = data
    ? new BigNumber(data.totalShares)
        .multipliedBy(new BigNumber(data.mDfiDfiRatio))
        .multipliedBy(new BigNumber(dfiPriceUsdValue))
    : new BigNumber(0);
  const marketCapValue = marketCap.toNumber();

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
            className={clsx("w-[168px] h-[168px] lg:w-[224px] lg:h-[224px]")}
          />
          <div className="flex flex-col justify-between gap-x-6 gap-y-2 w-full">
            <div className="details-container-ui px-6 py-4 flex flex-row justify-between items-center">
              <span className="body-2-regular-text flex-1">Market Cap</span>
              <h4 className="h4-text flex-1 text-end">
                ${formatNumberWithSuffix(marketCapValue)}
              </h4>
            </div>
            <div className="details-container-ui px-6 py-4 flex flex-row justify-between items-center">
              <span className="body-2-regular-text flex-1">Price</span>
              <NumericFormat
                className="h4-text flex-1 text-end"
                value={dfiPriceUsdValue}
                suffix=" DFI"
                decimalScale={getDecimalPlace(dfiPriceUsdValue)}
                trimTrailingZeros={false}
              />
            </div>
            <div className="details-container-ui px-6 py-4 flex flex-row justify-between items-center">
              <span className="body-2-regular-text flex-1">
                Total value locked
              </span>
              <h4 className="h4-text flex-1 text-end">
                ${formatNumberWithSuffix(marketCapValue)}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
