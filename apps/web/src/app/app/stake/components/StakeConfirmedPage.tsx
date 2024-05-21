import { getDecimalPlace } from "@/lib/textHelper";
import { CTAButton } from "@/components/button/CTAButton";
import { CTAButtonOutline } from "@/components/button/CTAButtonOutline";
import ConfirmScreen from "@/app/app/components/ConfirmScreen";
import { StakeStep } from "@/app/app/stake/page";

export default function StakeConfirmedPage({
  stakeAmount,
  hash,
  receivingWalletAddress,
  setCurrentStep,
  previewDeposit,
}: {
  stakeAmount: string;
  hash: string;
  previewDeposit: string;
  receivingWalletAddress: string;
  setCurrentStep: (step: StakeStep) => void;
}) {
  return (
    <ConfirmScreen
      hasCompleted={true}
      title="Stake confirmed"
      description="This may take a moment. It is safe to close this window – your transaction will reflect automatically in your wallet once completed."
      dfiAmounts={[
        {
          label: "Amount staked",
          value: {
            value: stakeAmount,
            suffix: " DFI",
            decimalScale: getDecimalPlace(stakeAmount),
          },
        },
        {
          label: "Amount to receive",
          value: {
            value: previewDeposit,
            suffix: " mDFI",
            decimalScale: getDecimalPlace(previewDeposit),
          },
        },
      ]}
      details={[
        {
          label: "Receiving Address",
          value: receivingWalletAddress,
          linkType: "address",
        },
        {
          label: "Transaction ID",
          value: hash,
          linkType: "tx",
        },
      ]}
      buttons={
        <>
          <CTAButton
            label="Return to main page"
            testID="stake-confirming-return-main"
            customStyle="w-full"
            onClick={() => setCurrentStep(StakeStep.StakePage)}
          />
          <CTAButtonOutline
            label="Add mDFI to wallet"
            testID="stake-confirming-add-mdfi"
            customStyle="w-full"
          />
        </>
      }
    />
  );
}
