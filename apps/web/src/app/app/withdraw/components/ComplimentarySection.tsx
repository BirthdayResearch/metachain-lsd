import React from "react";
import clsx from "clsx";
import { CTAButton } from "@/components/button/CTAButton";

export default function ComplimentarySection({
  customStyle,
}: {
  customStyle?: string;
}) {
  return (
    <div
      className={clsx(
        "flex flex-col md:flex-row gap-y-5 items-center md:py-8 py-10 lg:py-10 mt-12 md:mt-10 lg:mt-16 gap-x-4",
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
