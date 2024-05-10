import ConfirmingPage from "@/app/app/components/ConfirmingPage";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import { useEffect, useState } from "react";
import DetailsRow from "@/app/app/components/DetailsRow";
import { CTAButton } from "@/components/button/CTAButton";
import { CTAButtonOutline } from "@/components/button/CTAButtonOutline";

export default function StakeConfirmingPage() {
  const { copy } = useCopyToClipboard();
  const [showSuccessCopy, setShowSuccessCopy] = useState(false);

  const handleOnCopy = (text: string | undefined) => {
    if (text) {
      copy(text);
      setShowSuccessCopy(true);
    }
  };

  useEffect(() => {
    if (showSuccessCopy) {
      setTimeout(() => setShowSuccessCopy(false), 2000);
    }
  }, [showSuccessCopy]);
  return (
    <ConfirmingPage
      title="Confirming your stake…"
      description="Waiting confirmation from the blockchain. It is safe to close this window – your transaction will reflect automatically in your wallet once completed."
      showSuccessCopy={showSuccessCopy}
      buttons={
        <>
          <CTAButton
            label="Return to main page"
            testID="stake-confirming-return-main"
            customStyle="w-full"
          />
          <CTAButtonOutline
            label="Add mDFI to wallet"
            testID="stake-confirming-add-mdfi"
            customStyle="w-full"
          />
        </>
      }
    >
      <>
        <DetailsRow label="You are staking" value="2 DFI" />
        <DetailsRow label="You will receive" value="2 mDFI" />
        <DetailsRow
          label="Receiving Address"
          value="0xe8asdasdasdaasdkl2391923212312593"
        />
        <DetailsRow
          hasTxId
          label="Transaction ID"
          value="0x78d75a997b2d1a074bb2b6a042ae262d675e3a5c8c2a1beeee94701d4bff3af7"
          handleOnCopy={handleOnCopy}
        />
      </>
    </ConfirmingPage>
  );
}
