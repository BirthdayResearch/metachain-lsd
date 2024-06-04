import React from "react";
import clsx from "clsx";
import Image from "next/image";
import { CTAButton } from "@/components/button/CTAButton";
import { useAccount } from "wagmi";
import { MdAccessTimeFilled } from "react-icons/md";
import { FaCircleCheck } from "react-icons/fa6";

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
  return (
    <div className="flex flex-col gap-y-5 md:gap-y-4">
      <div
        className={clsx(
          "flex flex-col justify-between md:flex-row items-center",
          customStyle,
        )}
      >
        <div className="hidden md:flex gap-y-2">
          <div className="flex flex-col min-w-[168px]">
            <span className="text-xs text-light-1000/70">Withdrawals</span>
            <div className="flex mt-2 gap-x-2">
              <CTAButton
                label="0"
                testId="pending-withdrawals-button"
                customStyle="!px-3 !py-3 md:!py-1"
                customTextStyle="font-semibold leading-5 text-light-1000/30"
                customBgColor="withdraw-button-bg"
              >
                <MdAccessTimeFilled className="text-warning" size={12} />
              </CTAButton>
              <CTAButton
                label="0"
                testId="confirmed-withdrawals-button"
                customStyle="!px-3 !py-3 md:!py-1"
                customTextStyle="font-semibold leading-5 text-light-1000/30"
                customBgColor="withdraw-button-bg"
              >
                <FaCircleCheck className="text-green" size={10} />
              </CTAButton>
            </div>
          </div>
          <span className="block h-[52px] mx-3 border-dark-00/10 border-[0.5px]" />
          <div className="flex flex-col">
            <span className="text-xs text-light-1000/70">Total available</span>
            <div className="flex gap-x-1 mt-3 items-end">
              <span className="font-semibold leading-5 text-right">0 DFI</span>
              <span className="text-xs text-right text-dark-00/70">$0.0</span>
            </div>
          </div>
        </div>
        <div className="flex w-full md:hidden">
          <div className="flex flex-col w-full">
            <span className="font-semibold text-sm text-light-1000 mb-2">
              Withdrawals
            </span>
            <div className="flex items-center py-2 justify-between">
              <div className="flex gap-x-1">
                <span className="text-xs text-light-1000">Pending</span>
                <MdAccessTimeFilled className="text-warning" size={16} />
              </div>
              <span className="font-semibold leading-5 text-right">0</span>
            </div>
            <span className="block w-full my-1.5 border-dark-00/10 border-[0.5px]" />
            <div className="flex items-center py-2 justify-between">
              <div className="flex gap-x-1">
                <span className="text-xs text-light-1000">Available</span>
                <FaCircleCheck className="text-green" size={14} />
              </div>
              <span className="font-semibold leading-5 text-right">0</span>
            </div>
            <span className="block w-full my-1.5 border-dark-00/10 border-[0.5px]" />
            <div className="flex py-2 justify-between">
              <span className="text-xs text-light-1000">Total available</span>
              <div className="flex flex-col gap-y-1">
                <span className="font-semibold leading-5 text-right">
                  0 DFI
                </span>
                <span className="text-xs text-right text-dark-00/70">$0.0</span>
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
            customBgColor="withdraw-button-bg"
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
