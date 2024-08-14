import { getDecimalPlace } from "@/lib/textHelper";
import { CTAButton } from "@/components/button/CTAButton";
import { CTAButtonOutline } from "@/components/button/CTAButtonOutline";
import ConfirmScreen from "@/app/app/components/ConfirmScreen";
import { StakeStep } from "@/types";
import { LinkType } from "@/app/app/components/DetailsRow";

export default function StakeConfirmedPage({
  stakeAmount,
  hash,
  receivingWalletAddress,
  currentStep,
  setCurrentStep,
  previewDeposit,
  resetFields,
  addTokenToWallet,
  isAddTokenRequested,
}: {
  stakeAmount: string;
  hash: string;
  previewDeposit: string;
  receivingWalletAddress: string;
  currentStep: StakeStep;
  setCurrentStep: (step: StakeStep) => void;
  resetFields: () => void;
  addTokenToWallet: () => void;
  isAddTokenRequested: boolean;
}) {
  const isStakeConfirming = currentStep === StakeStep.StakeConfirmingPage;

  return (
    <ConfirmScreen
      isLoading={currentStep === StakeStep.StakeConfirmingPage}
      isComplete={currentStep === StakeStep.StakeConfirmationPage}
      title={isStakeConfirming ? "Confirming your stake…" : "Stake confirmed"}
      description={
        isStakeConfirming
          ? "Waiting confirmation from the blockchain. It is safe to close this window – your transaction will reflect automatically in your wallet once completed."
          : "This may take a moment. It is safe to close this window – your transaction will reflect automatically in your wallet once completed."
      }
      dfiAmounts={[
        {
          label: isStakeConfirming ? "You are staking" : "Amount staked",
          value: {
            value: stakeAmount,
            suffix: " DFI",
            decimalScale: getDecimalPlace(stakeAmount),
          },
        },
        {
          label: isStakeConfirming ? "You will receive" : "Amount to receive",
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
          linkType: LinkType.ADDRESS,
        },
        {
          label: "Transaction ID",
          value: hash,
          linkType: LinkType.TX,
        },
      ]}
      buttons={
        <>
          <CTAButton
            label="Return to main page"
            testId="stake-confirming-return-main"
            customStyle="w-full"
            onClick={() => {
              resetFields();
              setCurrentStep(StakeStep.StakePage);
            }}
          />
          <CTAButtonOutline
            label="Add mDFI to wallet"
            testId="stake-confirming-add-mdfi"
            customStyle="w-full"
            isDisabled={isAddTokenRequested}
            onClick={addTokenToWallet}
          />
        </>
      }
    />
  );
}
