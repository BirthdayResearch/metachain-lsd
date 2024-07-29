import ConfirmScreen from "@/app/app/components/ConfirmScreen";
import { useReadContract } from "wagmi";
import { getDecimalPlace } from "@/lib/textHelper";
import { CTAButton } from "@/components/button/CTAButton";
import { CTAButtonOutline } from "@/components/button/CTAButtonOutline";
import { WithdrawStep } from "@/types";
import { LinkType } from "@/app/app/components/DetailsRow";
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
  submitClaim,
}: {
  withdrawAmount: string;
  amountToReceive: string;
  submitClaim: (selectedReqIds: string[], totalClaimAmt: string) => void;
  withdrawRequestId: string | null;
  setCurrentStep: (step: WithdrawStep) => void;
  hash: string;
  receivingWalletAddress: string;
  resetFields: () => void;
}) {
  const { MarbleLsdProxy } = useContractContext();

  const { data: lastFinalizedRequestData } = useReadContract({
    address: MarbleLsdProxy.address,
    abi: MarbleLsdProxy.abi,
    functionName: "lastFinalizedRequestId",
    query: {
      enabled: !!withdrawRequestId,
    },
  });

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
                submitClaim([withdrawRequestId], amountToReceive);
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
