import React, { useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import { CTAButton } from "@/components/button/CTAButton";
import { useAccount } from "wagmi";
import { MdAccessTimeFilled } from "react-icons/md";
import { FaCircleCheck } from "react-icons/fa6";
import useGetWithdrawalDetails from "@/hooks/useGetWithdrawalDetails";
import { formatEther } from "ethers";
import { getDecimalPlace } from "@/lib/textHelper";
import NumericFormat from "@/components/NumericFormat";
import { WithdrawalsPopup } from "@/app/app/withdraw/components/WithdrawalsPopup";
import { WithdrawalsPopupMobile } from "@/app/app/withdraw/components/WithdrawalsPopupMobile";
import useResponsive from "@/hooks/useResponsive";

export default function ComplimentarySection() {
  const { isConnected } = useAccount();

  return (
    <div className="absolute left-0 py-5 md:py-8 lg:py-10 px-5 md:px-10 lg:px-[120px] mt-12 md:mt-10 lg:mt-16 rounded-b-[30px] complimentary-bg">
      {isConnected ? <WithdrawalDetails /> : <WithdrawalsFaq />}
    </div>
  );
}

function WithdrawalsFaq({ customStyle }: { customStyle?: string }) {
  return (
    <div
      className={clsx(
        "flex flex-col md:flex-row gap-y-5 items-center gap-x-4",
        customStyle,
      )}
    >
      <div className="flex flex-col gap-y-2">
        <span className="text-sm font-semibold">Withdrawal process</span>
        <span className="text-xs text-light-1000/50">
          Claims for withdrawals approximately take 7 processing days. Once your
          claim is processed, you can submit your claim to receive your DFI.
          Make sure to regularly check your wallet for your withdrawal claims.
        </span>
      </div>
      <div className="w-full md:w-fit">
        <CTAButton
          label="View FAQs"
          testId="faq-button-complimentary-section"
          customStyle="!px-3 !py-3 md:!py-2"
          customTextStyle="whitespace-nowrap text-xs font-medium"
          customBgColor="button-bg-gradient-1"
        />
      </div>
    </div>
  );
}

function WithdrawalDetails({ customStyle }: { customStyle?: string }) {
  const { isMobile } = useResponsive();
  const [isActive, setIsActive] = useState(false);

  const handleOnClick = () => {
    setIsActive(!isActive);
  };

  const {
    pendingWithdrawalsArray,
    confirmedWithdrawalsArray,
    withdrawalStatusData,
  } = useGetWithdrawalDetails();

  const anyWithdrawalRequests =
    pendingWithdrawalsArray.length > 0 || confirmedWithdrawalsArray.length > 0;

  const totalPendingCount = (pendingWithdrawalsArray.length ?? 0).toString();
  const totalConfirmedCount = (
    confirmedWithdrawalsArray.length ?? 0
  ).toString();

  const { totalShares, totalAssets } = withdrawalStatusData?.reduce(
    (acc, item) => {
      return {
        totalShares:
          BigInt(acc.totalShares) + BigInt(item.amountOfShares as bigint),
        totalAssets:
          BigInt(acc.totalAssets) + BigInt(item.amountOfAssets as bigint),
      };
    },
    { totalShares: BigInt(0), totalAssets: BigInt(0) },
  ) ?? { totalShares: BigInt(0), totalAssets: BigInt(0) };

  const formattedTotalShares = formatEther(totalShares.toString());
  const formattedTotalAssets = formatEther(totalAssets.toString());

  return (
    <div className="flex flex-col gap-y-5 md:gap-y-4">
      <div
        className={clsx(
          "flex flex-col justify-between md:flex-row items-center",
          customStyle,
        )}
      >
        {/* Web view */}
        <div className="hidden md:flex gap-y-2">
          <div className="relative flex flex-col min-w-[168px]">
            {isActive && (
              <WithdrawalsPopup
                pendingWithdrawalsArray={pendingWithdrawalsArray}
                confirmedWithdrawalsArray={confirmedWithdrawalsArray}
                onClose={handleOnClick}
              />
            )}
            <span className="text-xs text-light-1000/70">Withdrawals</span>
            <div
              className="flex mt-2 gap-x-2"
              onClick={anyWithdrawalRequests ? handleOnClick : undefined}
            >
              <CTAButton
                label={totalPendingCount}
                testId="pending-withdrawals-button"
                customStyle="!px-3 !py-3 md:!py-1"
                customTextStyle={clsx(
                  "font-semibold leading-5",
                  { "text-light-1000/30": pendingWithdrawalsArray.length <= 0 },
                  { "text-light-1000/70": pendingWithdrawalsArray.length > 0 },
                )}
                customBgColor="button-bg-gradient-1"
              >
                <MdAccessTimeFilled className="text-warning" size={12} />
              </CTAButton>
              <CTAButton
                label={totalConfirmedCount}
                testId="confirmed-withdrawals-button"
                customStyle="!px-3 !py-3 md:!py-1 bg-red-200"
                customTextStyle={clsx(
                  "font-semibold leading-5",
                  {
                    "text-light-1000/30": confirmedWithdrawalsArray.length <= 0,
                  },
                  {
                    "text-light-1000/70": confirmedWithdrawalsArray.length > 0,
                  },
                )}
                customBgColor="button-bg-gradient-1"
              >
                <FaCircleCheck className="text-green" size={10} />
              </CTAButton>
            </div>
          </div>
          <span className="block h-[52px] mx-3 border-dark-00/10 border-[0.5px]" />
          <div className="flex flex-col">
            <span className="text-xs text-light-1000/70">Total available</span>
            <div className="flex gap-x-1 mt-3 items-end">
              <NumericFormat
                className="font-semibold leading-5 text-right"
                suffix="DFI"
                value={formattedTotalAssets}
                decimalScale={getDecimalPlace(formattedTotalAssets)}
              />
              <NumericFormat
                className="text-xs text-right text-dark-00/70"
                prefix="$"
                value={formattedTotalShares}
                decimalScale={getDecimalPlace(formattedTotalShares)}
              />
            </div>
          </div>
        </div>

        {/* Mobile view*/}
        <div className="flex w-full md:hidden">
          <div className="relative flex flex-col w-full">
            {isActive && isMobile && (
              <WithdrawalsPopupMobile
                pendingWithdrawalsArray={pendingWithdrawalsArray}
                confirmedWithdrawalsArray={confirmedWithdrawalsArray}
                onClose={handleOnClick}
                isActive={isActive}
              />
            )}
            <span className="font-semibold text-sm text-light-1000 mb-2">
              Withdrawals
            </span>
            <div
              className="flex items-center py-2 justify-between"
              onClick={anyWithdrawalRequests ? handleOnClick : undefined}
            >
              <div className="flex gap-x-1">
                <span className="text-xs text-light-1000">Pending</span>
                <MdAccessTimeFilled className="text-warning" size={16} />
              </div>
              <span className="font-semibold leading-5 text-right">
                {totalPendingCount}
              </span>
            </div>
            <span className="block w-full my-1.5 border-dark-00/10 border-[0.5px]" />
            <div className="flex items-center py-2 justify-between">
              <div className="flex gap-x-1">
                <span className="text-xs text-light-1000">Available</span>
                <FaCircleCheck className="text-green" size={14} />
              </div>
              <span className="font-semibold leading-5 text-right">
                {totalConfirmedCount}
              </span>
            </div>
            <span className="block w-full my-1.5 border-dark-00/10 border-[0.5px]" />
            <div className="flex py-2 justify-between">
              <span className="text-xs text-light-1000">Total available</span>
              <div className="flex flex-col gap-y-1">
                <NumericFormat
                  className="font-semibold leading-5 text-right"
                  suffix="DFI"
                  value={formattedTotalAssets}
                  decimalScale={getDecimalPlace(formattedTotalAssets)}
                />
                <NumericFormat
                  className="text-xs text-right text-dark-00/70"
                  prefix="$"
                  value={formattedTotalShares}
                  decimalScale={getDecimalPlace(formattedTotalShares)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-fit">
          <CTAButton
            isDisabled={true}
            label="Claim DFI"
            testId="claim-dfi-button"
            customStyle="w-full md:!px-3 md:!py-2 disabled:opacity-50"
            customTextStyle="whitespace-nowrap text-xs font-medium"
            customBgColor="button-bg-gradient-1"
          >
            <Image
              data-testid="dfi-icon"
              src="/icons/dfi-icon.svg"
              alt="DFI icon"
              className="min-w-6"
              priority
              width={24}
              height={24}
            />
          </CTAButton>
        </div>
      </div>
      <span className="text-xs text-light-1000/50">
        Claims for withdrawals approximately take 7 processing days. Once
        processed, you can submit claim to receive your DFI in your wallet. Make
        sure to regularly check your wallet.
      </span>
    </div>
  );
}
