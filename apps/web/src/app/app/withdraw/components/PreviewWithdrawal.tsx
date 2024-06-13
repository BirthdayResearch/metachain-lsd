import ConfirmScreen from "@/app/app/components/ConfirmScreen";
import { getDecimalPlace } from "@/lib/textHelper";
import { CTAButton } from "@/components/button/CTAButton";
import { WithdrawStep } from "@/types";
import { LinkType } from "@/app/app/components/DetailsRow";

export default function PreviewWithdrawal({
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
          value: "Pending",
          linkType: LinkType.STATUS,
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
