import ConfirmScreen from "@/app/app/components/ConfirmScreen";
import { getDecimalPlace } from "@/lib/textHelper";
import { CTAButton } from "@/components/button/CTAButton";
import { WithdrawStep } from "@/types";
import { LinkType } from "@/app/app/components/DetailsRow";

export default function ClaimConfirmation({
  claimHash,
  claimAmount,
  receivingWalletAddress,
  setCurrentStep,
  resetFields,
  isClaimWithdrawalsTxnSuccess,
}: {
  claimHash: string;
  isClaimWithdrawalsTxnSuccess: boolean;
  claimAmount: string;
  receivingWalletAddress: string;
  setCurrentStep: (step: WithdrawStep) => void;
  resetFields: () => void;
}) {
  return (
    <ConfirmScreen
      isComplete={isClaimWithdrawalsTxnSuccess}
      isLoading={!isClaimWithdrawalsTxnSuccess}
      title={
        isClaimWithdrawalsTxnSuccess
          ? "Claim confirmed"
          : "Confirming your claim…"
      }
      description={
        "Waiting confirmation from the blockchain. It is safe to close this window – your transaction will reflect automatically in your wallet once completed."
      }
      dfiAmounts={[
        {
          label: "Amount to receive",
          value: {
            value: claimAmount,
            suffix: " mDFI",
            decimalScale: getDecimalPlace(claimAmount),
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
          value: claimHash,
          linkType: LinkType.TX,
        },
      ]}
      buttons={
        <CTAButton
          label="Return to Main Page"
          testId="proceed-to-claim-withdrawal"
          customStyle="w-full"
          onClick={() => {
            resetFields();
            setCurrentStep(WithdrawStep.WithdrawPage);
          }}
        />
      }
    />
  );
}
