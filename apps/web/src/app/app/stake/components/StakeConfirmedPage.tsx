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
  setCurrentStep: (step: StakeStep) => void;
  resetFields: () => void;
  addTokenToWallet: () => void;
  isAddTokenRequested: boolean;
}) {
  return (
    <ConfirmScreen
      isComplete={true}
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
