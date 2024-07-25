import ConfirmScreen from "@/app/app/components/ConfirmScreen";
import { useReadContract } from "wagmi";
import { getDecimalPlace } from "@/lib/textHelper";
import { CTAButton } from "@/components/button/CTAButton";
import { CTAButtonOutline } from "@/components/button/CTAButtonOutline";
import { WithdrawStep } from "@/types";
import { LinkType } from "@/app/app/components/DetailsRow";
import useProceedToClaim from "@/hooks/useProceedToClaim";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useContractContext } from "@/context/ContractContext";
import BigNumber from "bignumber.js";

export default function WithdrawalConfirmation({
  withdrawAmount,
  amountToReceive,
  setCurrentStep,
  withdrawRequestId,
  hash,
  receivingWalletAddress,
  resetFields,
}: {
  withdrawAmount: string;
  amountToReceive: string;
  withdrawRequestId: string | null;
  setCurrentStep: (step: WithdrawStep) => void;
  hash: string;
  receivingWalletAddress: string;
  resetFields: () => void;
}) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { MarbleLsdProxy } = useContractContext();

  const { data: lastFinalizedRequestData } = useReadContract({
    address: MarbleLsdProxy.address,
    abi: MarbleLsdProxy.abi,
    functionName: "lastFinalizedRequestId",
    query: {
      enabled: !!withdrawRequestId,
    },
  });

  const onSuccess = () => {
    resetFields();
    setCurrentStep(WithdrawStep.WithdrawPage);
  };
  const { writeClaimWithdrawal } = useProceedToClaim({
    setErrorMessage,
    onSuccess,
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

    // cleanup
    return () => toast.remove("errorMessage");
  }, [errorMessage]);

  const isFinalized =
    withdrawRequestId &&
    new BigNumber(lastFinalizedRequestData?.toString() ?? 0).gte(
      withdrawRequestId,
    );

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
          value: isFinalized ? "Ready for claim" : "Withdrawal Requested",
          linkType: LinkType.STATUS,
        },
      ]}
      buttons={
        <>
          {isFinalized && (
            <CTAButton
              label="Proceed to claim"
              testId="proceed-to-claim-withdrawal"
              customStyle="w-full"
              onClick={() => {
                writeClaimWithdrawal([withdrawRequestId]);
              }}
            />
          )}
          <CTAButtonOutline
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
