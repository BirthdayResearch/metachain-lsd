"use client";

import { useBalance, useAccount } from "wagmi";
import { useEffect, useMemo, useState } from "react";
import { ConnectKitButton } from "connectkit";
import BigNumber from "bignumber.js";
import { CTAButton } from "@/app/ui/components/button/CTAButton";
import { useRouter } from "next/navigation";
import { useDfiPrice } from "@/app/lib/hooks/useDfiPrice";
import { useNetworkContext } from "@waveshq/walletkit-ui";
import DialogueBox from "@/app/stake/components/DialogueBox";

export default function Stake() {
  const { push } = useRouter();

  const { address, isConnected, status } = useAccount();
  console.log({ address, isConnected, status });
  const { data: walletBalance } = useBalance({
    address,
  });

  const { network } = useNetworkContext();
  const dfiPrice = useDfiPrice();

  const [stakeAmount, setStakeAmount] = useState<string>("");
  const [walletBalanceAmount, setWalletBalanceAmount] = useState<string>("NA");
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);

  // To display stake amount in USD
  const stakedValue = useMemo(() => {
    const calculatedStake = new BigNumber(stakeAmount).multipliedBy(dfiPrice);
    return calculatedStake.isNaN() ? "0.00" : calculatedStake.toString();
  }, [stakeAmount, dfiPrice]);

  function getActionBtnLabel() {
    switch (true) {
      case isConnected:
        return "Stake DFI";

      default:
        return "Connect wallet";
    }
  }

  useEffect(() => {
    setWalletBalanceAmount(walletBalance?.formatted ?? "NA"); // set wallet balance
    setIsWalletConnected(isConnected);
  }, [address, status, network]);

  return (
    <DialogueBox>
      <div className="grid gap-y-10">
        <div className="gap-y-6 grid">
          <ConnectKitButton.Custom>
            {({ show }) => (
              <CTAButton
                testID="instant-transfer-btn"
                label={getActionBtnLabel()}
                customStyle="w-full md:py-5"
              />
            )}
          </ConnectKitButton.Custom>
        </div>
      </div>
    </DialogueBox>
  );
}
