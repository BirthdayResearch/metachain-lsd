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
}: {
  claimHash: string;
  claimAmount: string;
  receivingWalletAddress: string;
  setCurrentStep: (step: WithdrawStep) => void;
  resetFields: () => void;
}) {
  return (
    <ConfirmScreen
      isLoading={false}
      title="Claimed DFI"
      description="Your request for withdrawal is now being processed. Your claim for withdrawal is automatically sent to your wallet once it is ready."
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
