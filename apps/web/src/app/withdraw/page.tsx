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
import { InputCard } from "@/app/ui/components/InputCard";
import { CTAButton } from "@/app/ui/components/button/CTAButton";
import { useRouter } from "next/navigation";
import { useDfiPrice } from "@/app/lib/hooks/useDfiPrice";
import { useContractContext } from "@/app/lib/context/ContractContext";
import { useNetworkContext } from "@waveshq/walletkit-ui";
import DialogueBox from "@/app/stake/components/DialogueBox";
import WithdrawalsFooter from "@/app/withdraw/components/WithdrawalsFooter";
import Image from "next/image";

export default function Withdraw() {
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

  async function submitStake() {
    if (isDepositTxnSuccess) {
      // redirect to main page
      push("/");
      return;
    }
    // additional checks to ensure that the user's wallet balance is sufficient to cover the deposit amount
    // ensure that the entered amount meets the min. deposit req defined by the contract's minDeposit Variable

    if (isDepositPaused) {
      // TODO display popup
      console.log("Deposit is paused");
      // display message to user that deposit is paused
      return;
    }
    console.log("call stake");
    try {
      if (isDepositPaused) {
        // TODO display popups
        console.log("Deposit is paused");
        // display message to user that deposit is paused
        return;
      }
      writeDepositTxn?.();
    } catch (error) {
      console.error("Deposit failed:", error);
      // Handle error (e.g., display error message to user)
    }
  }

  function getActionBtnLabel() {
    switch (true) {
      case isDepositTxnSuccess:
        return "Return to Main Page";

      case isConnected:
        return "Withdraw mDFI";

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
        <div>
          <h3 className="text-2xl font-semibold mb-8">Withdraw DFI</h3>
          <div className="flex w-full justify-between mb-1">
            <span className="text-xs font-medium">
              How much do you want to withdraw?
            </span>
            {isWalletConnected ? (
              <p>
                <span className="opacity-40">Available: </span>
                <span className="font-semibold opacity-70">
                  {walletBalanceAmount}
                </span>
              </p>
            ) : (
              <span className="text-xs text-warning font-semibold">
                Connect wallet to get started
              </span>
            )}
          </div>
          <div className="gap-y-6 grid">
            <InputCard
              amount={stakeAmount}
              onChange={setStakeAmount}
              maxAmount={new BigNumber(walletBalanceAmount)}
              displayPercentageBtn={isWalletConnected}
              disabled={isDepositInProgress || isDepositTxnInProgress}
              icon={
                <Image
                  data-testid="mdfi-logo"
                  src="/mDFI.svg"
                  alt="mDFI Logo"
                  width={23.7}
                  height={23.7}
                />
              }
              customStyle="px-6 py-4"
            />
            <section>
              <TransactionRow
                label="You will receive"
                value={`${previewDepositFormatted} mDFI`}
              />
              <TransactionRow label="Exchange rate" value="1 mDFI = 1 DFI" />
              {/* TODO fee schedule*/}
              <TransactionRow label="Max transaction cost" value="$0.00" />
            </section>
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

        <WithdrawalsFooter />
      </div>
    </DialogueBox>
  );
}

function TransactionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-row justify-between py-[10px]">
      <span>{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}
