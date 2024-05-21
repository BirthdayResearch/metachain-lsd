import ConfirmScreen from "@/app/app/components/ConfirmScreen";
import { getDecimalPlace } from "@/lib/textHelper";
import { CTAButton } from "@/components/button/CTAButton";
import { CTAButtonOutline } from "@/components/button/CTAButtonOutline";
import { StakeStep } from "@/app/app/stake/page";

export default function StakeConfirmingPage({
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
      isLoading={true}
      title="Confirming your stake…"
      description="Waiting confirmation from the blockchain. It is safe to close this window – your transaction will reflect automatically in your wallet once completed."
      dfiAmounts={[
        {
          label: "You are staking",
          value: {
            value: stakeAmount,
            suffix: " DFI",
            decimalScale: getDecimalPlace(stakeAmount),
          },
        },
        {
          label: "You will receive",
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
