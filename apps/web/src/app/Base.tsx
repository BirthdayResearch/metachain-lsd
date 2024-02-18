"use client";

import MarbleLsdV1 from "../../../../packages/smartcontracts/src/artifacts/contracts/MarbleLsdV1.sol/MarbleLsdV1.json";
import {
  erc20ABI,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useBalance,
  useAccount,
} from "wagmi";
import { InputCard } from "@/app/ui/components/InputCard";
import { useState } from "react";
import { CTAButton } from "@/app/ui/components/button/CTAButton";

// import ABI code from smartcontracts/build/contracts/MarblwLsdV1.json
const abi = MarbleLsdV1.abi;

export default function Base() {
  const { address, isConnected } = useAccount();
  const { data: walletBalance } = useBalance({
    address,
  });
  const walletBalanceAmount = walletBalance?.formatted ?? "NA";
  console.log({ walletBalanceAmount });

  const [stakeAmount, setStakeAmount] = useState<string>("");

  function submitStake() {
    console.log("call stake");
    // Call the contract
    const { data: readData, isLoading: isReading } = usePrepareContractWrite({
      abi,
      address: "0x9FA70916182c75F401bF038EC775266941C46909", // contract address
      functionName: "deposit",
      args: [
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", // receiver address
        /* amount of dfi or ethers*/
      ],
    });

    // Wait for the transaction to be mined
    // const { transactionHash } = useWaitForTransaction({
    //   send,
    // });

    // if (isMining) {
    //   console.log("Mining...");
    // } else if (transactionHash) {
    //   console.log("Transaction hash: ", transactionHash);
    // }
  }

  return (
    <div className="w-full flex flex-col">
      <h3>Stake DFI</h3>
      <div className="flex w-full justify-between">
        <span>Enter amount to stake</span>
        <span>Available: {walletBalanceAmount}</span>
      </div>
      <InputCard amt={stakeAmount} setAmt={setStakeAmount} />
      <CTAButton text="Stake" testID="stake" onClick={submitStake} />
    </div>
  );
}
