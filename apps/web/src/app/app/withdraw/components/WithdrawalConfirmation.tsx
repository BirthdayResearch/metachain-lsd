import ConfirmScreen from "@/app/app/components/ConfirmScreen";
import { getDecimalPlace } from "@/lib/textHelper";
import { CTAButton } from "@/components/button/CTAButton";
import { WithdrawStep } from "@/types";
import { LinkType } from "@/app/app/components/DetailsRow";
import useProceedToClaim from "@/hooks/useProceedToClaim";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function WithdrawalConfirmation({
  withdrawAmount,
  amountToReceive,
  setCurrentStep,
  hash,
  receivingWalletAddress,
  resetFields,
}: {
  withdrawAmount: string;
  amountToReceive: string;
  setCurrentStep: (step: WithdrawStep) => void;
  hash: string;
  receivingWalletAddress: string;
  resetFields: () => void;
}) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { writeClaimWithdrawals } = useProceedToClaim({
    setErrorMessage,
  });

  useEffect(() => {
    if (errorMessage != null) {
      toast(errorMessage, {
        duration: 5000,
        className:
          "!bg-light-900 px-2 py-1 !text-xs !text-light-00 mt-10 !rounded-md",
        id: "errorMessage",
      });
    }
  }, [errorMessage]);

  return (
    <ConfirmScreen
      isLoading={false}
      title="Requested Withdrawal"
      description="Your request for withdrawal is now being processed. Your claim for withdrawal is automatically sent to your wallet once it is ready."
      dfiAmounts={[
        {
          label: "You are withdrawing",
          value: {
            value: withdrawAmount,
            suffix: " mDFI",
            decimalScale: getDecimalPlace(withdrawAmount),
          },
        },
        {
          label: "You will receive",
          value: {
            value: amountToReceive,
            suffix: " DFI",
            decimalScale: getDecimalPlace(amountToReceive),
          },
        },
      ]}
      details={[
        {
          label: "Receiving Address",
          value: receivingWalletAddress,
          linkType: LinkType.ADDRESS,
        },
        {
          label: "Transaction ID",
          value: hash,
          linkType: LinkType.TX,
        },
        {
          label: "Status",
          value: "Ready for claim",
          linkType: LinkType.STATUS,
        },
      ]}
      buttons={
        <>
          <CTAButton
            label="Proceed to claim"
            testId="proceed-to-claim-withdrawal"
            customStyle="w-full"
            onClick={writeClaimWithdrawals}
          />
          <CTAButton
            label="Return to main page"
            testId="withdrawal-confirming-return-main"
            customStyle="w-full"
            onClick={() => {
              resetFields();
              setCurrentStep(WithdrawStep.WithdrawPage);
            }}
          />
        </>
      }
    />
  );
}
