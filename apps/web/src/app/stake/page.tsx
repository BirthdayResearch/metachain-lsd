"use client";

import MarbleLsdV1ABI from "../../config/ABIs/MarbleLsdV1.json";

import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useBalance,
  useAccount,
} from "wagmi";
import { useEffect, useState } from "react";
import { parseEther } from "viem";
import { ConnectKitButton } from "connectkit";
import BigNumber from "bignumber.js";
import { InputCard } from "@/app/ui/components/InputCard";
import { CTAButton } from "@/app/ui/components/button/CTAButton";

export default function Stake() {
  const { address, isConnected } = useAccount();

  const { data: walletBalance } = useBalance({
    address,
  });

  const [stakeAmount, setStakeAmount] = useState<string>("");
  const [walletBalanceAmount, setWalletBalanceAmount] = useState<string>("NA");
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);

  /*
    on user inpput change, call the deposit function to retrieve the amount of staked tokens
    check if deposit is paused when onload, and before you submit stake
      if paused: display message to user that deposit is paused
      if not paused: call the deposit function, return the transaction hash and display a success message to the user
    */
  // const {
  //   config: writeDepositTxnConfig,
  //   error: writeDepositTxnError,
  //   isError: depositeWriteTxnError,
  // } = usePrepareContractWrite({
  //   abi: MarbleLsdV1ABI,
  //   address: "0x9FA70916182c75F401bF038EC775266941C46909", // proxy contract address
  //   functionName: "deposit",
  //   args: ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"], // receiver address of the staked tokens
  //   value: parseEther(stakeAmount), // stake DFI
  // });

  const {
    data: depositFundData,
    error: depositFuncTxnError,
    write: writeDepositTxn,
  } = useContractWrite({
    abi: MarbleLsdV1ABI,
    address: "0x9FA70916182c75F401bF038EC775266941C46909", // proxy contract address
    functionName: "deposit",
    args: ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"], // receiver address of the staked tokens
    value: parseEther(stakeAmount), // stake DFI
  });

  const { data: previewDepositData, error: previewDepositTxnError } =
    useContractRead({
      abi: MarbleLsdV1ABI,
      address: "0x9FA70916182c75F401bF038EC775266941C46909", // proxy contract address
      functionName: "previewDeposit",
      args: [parseEther(stakeAmount)],
    });

  const { data: isDepositPaused, error: isDepositPausedError } =
    useContractRead({
      abi: MarbleLsdV1ABI,
      address: "0x9FA70916182c75F401bF038EC775266941C46909", // proxy contract address
      functionName: "isDepositPaused",
    });

  const previewDepositFormatted = new BigNumber(
    (previewDepositData as string) || 0,
  ).toFormat(2);

  const {
    error: depositTxnError,
    isLoading: isDepositInProgress,
    isSuccess,
  } = useWaitForTransaction({
    hash: depositFundData?.hash,
  });

  async function submitStake() {
    // additional checks to ensure that the user's wallet balance is sufficient to cover the deposit amount
    // ensure that the entered amount meets the min. deposit req defined by the contract's minDeposit Variable

    if (isDepositPaused) {
      console.log("Deposit is paused");
      // display message to user that deposit is paused
      return;
    }
    console.log("call stake");
    try {
      if (isDepositPaused) {
        console.log("Deposit is paused");
        // display message to user that deposit is paused
        return;
      }
      console.log("write");
      writeDepositTxn?.(); // only call write function if deposit is not paused
      // console.log("Deposit successful! Shares:", shares);
      // Handle successful deposit (e.g., display success message, update UI)
    } catch (error) {
      console.error("Deposit failed:", error);
      // Handle error (e.g., display error message to user)
    }
  }

  function getActionBtnLabel() {
    switch (true) {
      case isSuccess:
        return "Return to Main Page";

      case isConnected:
        return "Stake DFI";

      default:
        return "Connect wallet";
    }
  }

  useEffect(() => {
    // set wallet balance
    setWalletBalanceAmount(walletBalance?.formatted ?? "NA");
    setIsWalletConnected(isConnected);
  }, [address, isConnected]); // add env network

  return (
    <div className="w-full flex flex-col">
      <h3 className="text-2xl font-semibold mb-8">Stake DFI</h3>
      <div className="flex w-full justify-between mb-1">
        <span className="text-xs font-medium">Enter amount to stake</span>
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
          value={previewDepositFormatted}
          displayPercentageBtn={isWalletConnected}
        />
        <section>
          <TransactionRow label="You will receive" value="0.00 mDFI" />
          <TransactionRow label="Exchange rate" value="1 mDFI = 1 DFI" />
          <TransactionRow label="Estimated transaction cost" value="$0.00" />
        </section>
        <ConnectKitButton.Custom>
          {({ show }) => (
            <CTAButton
              testID="instant-transfer-btn"
              label={getActionBtnLabel()}
              customStyle="w-full md:py-5 !rounded-[10px]"
              // isLoading={hasPendingTxn || isVerifyingTransaction}
              // disabled={
              //   (isConnected && !isFormValid) ||
              //   hasPendingTxn ||
              //   !isBalanceSufficient
              // }
              disabled={!writeDepositTxn}
              onClick={!isConnected ? show : () => submitStake()}
            />
          )}
        </ConnectKitButton.Custom>
      </div>
    </div>
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
