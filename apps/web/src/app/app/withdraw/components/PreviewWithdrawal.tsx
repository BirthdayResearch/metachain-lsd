import ConfirmScreen from "@/app/app/components/ConfirmScreen";
import { getDecimalPlace } from "@/lib/textHelper";
import { CTAButton } from "@/components/button/CTAButton";
import { WithdrawStep } from "@/types";

export default function PreviewWithdrawal({
  withdrawAmount,
  previewWithdrawal,
  setCurrentStep,
  hash,
  receivingWalletAddress,
  resetFields,
}: {
  withdrawAmount: string;
  previewWithdrawal: string;
  setCurrentStep: (step: WithdrawStep) => void;
  hash: string;
  receivingWalletAddress: string;
  resetFields: () => void;
}) {
  return (
    <ConfirmScreen
      isLoading={true}
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
            value: previewWithdrawal,
            suffix: " DFI",
            decimalScale: getDecimalPlace(previewWithdrawal),
          },
        },
      ]}
      details={[
        {
          label: "Receiving Address",
          value: receivingWalletAddress,
          linkType: "tx",
        },
        {
          label: "Transaction ID",
          value: hash,
          linkType: "tx",
        },
        {
          label: "Status",
          value: "Pending",
          linkType: "status",
        },
      ]}
      buttons={
        <CTAButton
          label="Return to main page"
          testId="stake-confirming-return-main"
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
