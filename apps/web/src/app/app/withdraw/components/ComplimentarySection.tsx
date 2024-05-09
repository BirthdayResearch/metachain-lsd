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
        "rounded-[30px] flex items-center py-10 gap-x-4",
        customStyle,
      )}
    >
      <div className="flex flex-col gap-y-2">
        <span className="text-xs md:text-sm font-semibold">
          Withdrawal process
        </span>
        <span className="text-xs text-light-1000/50">
          Claims for withdrawals approximately take 7 processing days. Once your
          claim is processed, you can submit your claim to receive your DFI.
          Make sure to regularly check your wallet for your withdrawal claims.
        </span>
      </div>
      <div>
        <CTAButton
          label="View FAQs"
          testID="faq-button"
          customStyle="!px-3 !py-2 !faq-button-bg"
          customTextStyle="whitespace-nowrap text-xs font-medium"
        />
      </div>
    </div>
  );
}
