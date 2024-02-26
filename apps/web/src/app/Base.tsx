"use client";

import MarbleLsdV1ABI from "../config/ABIs/MarbleLsdV1.json";
// import { MarbleLsdV1__factory } from "smartcontracts";

import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useBalance,
  useAccount,
} from "wagmi";
import { InputCard } from "@/app/ui/components/InputCard";
import { useEffect, useState } from "react";
import { parseEther } from "viem";
import { CTAButton } from "@/app/ui/components/button/CTAButton";
import { ConnectKitButton } from "connectkit";
import BigNumber from "bignumber.js";
import WalletStatus from "@/app/ui/components/WalletStatus";

export default function Base() {
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
      <h3>Stake DFI</h3>
      <div className="flex w-full justify-between">
        <span>Enter amount to stake</span>
        {isWalletConnected ? (
          <div>Available: {walletBalanceAmount}</div>
        ) : (
          "Connect wallet to get started"
        )}
      </div>
      <InputCard
        amt={stakeAmount}
        setAmt={setStakeAmount}
        value={previewDepositFormatted}
      />
      <ConnectKitButton.Custom>
        {({ show }) => (
          <CTAButton
            testID="instant-transfer-btn"
            label={getActionBtnLabel()}
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
  );
}
