"use client";

import { formatEther } from "viem";

import {
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
  useBalance,
  useAccount,
} from "wagmi";
import { useEffect, useMemo, useState } from "react";
import { parseEther } from "viem";
import { ConnectKitButton } from "connectkit";
import BigNumber from "bignumber.js";
import { CTAButton } from "@/app/ui/components/button/CTAButton";
import { useRouter } from "next/navigation";
import { useDfiPrice } from "@/app/lib/hooks/useDfiPrice";
import { useContractContext } from "@/app/lib/context/ContractContext";
import { useNetworkContext } from "@waveshq/walletkit-ui";
import DialogueBox from "@/app/stake/components/DialogueBox";

export default function Stake() {
  const { push } = useRouter();

  const { address, isConnected, status } = useAccount();
  const { data: walletBalance } = useBalance({
    address,
  });

  const { MarbleLsdV1 } = useContractContext();
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

  const {
    data: depositFundData,
    error: depositFuncTxnError,
    write: writeDepositTxn,
    isLoading: isDepositInProgress,
  } = useContractWrite({
    abi: MarbleLsdV1.abi,
    address: MarbleLsdV1.address,
    functionName: "deposit",
    args: ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"], // receiver address of the staked tokens
    value: parseEther(stakeAmount),
  });

  const { data: previewDepositData, error: previewDepositTxnError } =
    useContractRead({
      abi: MarbleLsdV1.abi,
      address: MarbleLsdV1.address,
      functionName: "previewDeposit",
      args: [parseEther(stakeAmount)],
    });

  const { data: isDepositPaused, error: isDepositPausedError } =
    useContractRead({
      abi: MarbleLsdV1.abi,
      address: MarbleLsdV1.address,
      functionName: "isDepositPaused",
    });

  const previewDepositFormatted = previewDepositData
    ? formatEther(previewDepositData as unknown as bigint)
    : "0";

  const {
    error: depositTxnError,
    isLoading: isDepositTxnInProgress,
    isSuccess: isDepositTxnSuccess,
  } = useWaitForTransaction({
    hash: depositFundData?.hash,
  });

  function getActionBtnLabel() {
    switch (true) {
      case isDepositTxnSuccess:
        return "Return to Main Page";

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
                isLoading={isDepositInProgress || isDepositTxnInProgress}
                disabled={isDepositInProgress || isDepositTxnInProgress}
                onClick={!isConnected ? show : () => submitStake()}
              />
            )}
          </ConnectKitButton.Custom>
        </div>
      </div>
    </DialogueBox>
  );
}
