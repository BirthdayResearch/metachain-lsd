"use client";

import { useAccount, useBalance, useReadContract } from "wagmi";
import React, { useEffect, useMemo, useState } from "react";
import { formatEther } from "ethers";
import { useGetReadContractConfigs } from "@/hooks/useGetReadContractConfigs";
import { toWei } from "@/lib/textHelper";
import { useContractContext } from "@/context/ContractContext";
import { WithdrawStep } from "@/types";
import WithdrawPage from "@/app/app/withdraw/components/WithdrawPage";

export default function Withdraw() {
  const { address, isConnected, status, chainId } = useAccount();
  const { MarbleLsdProxy } = useContractContext();

  const { data: walletBalance } = useBalance({
    address,
    chainId,
  });

  const { minDepositAmount } = useGetReadContractConfigs();

  const [amountError, setAmountError] = useState<string | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [walletBalanceAmount, setWalletBalanceAmount] = useState<string>("");
  // To display /withdraw pages based on the current step
  const [currentStep, setCurrentStep] = useState<WithdrawStep>(
    WithdrawStep.WithdrawPage,
  );
  const { data: previewDepositData } = useReadContract({
    address: MarbleLsdProxy.address,
    abi: MarbleLsdProxy.abi,
    functionName: "previewDeposit",
    args: [toWei(withdrawAmount !== "" ? withdrawAmount : "0")],
    query: {
      enabled: isConnected,
    },
  });

  const previewDeposit = useMemo(() => {
    return formatEther((previewDepositData as number) ?? 0).toString();
  }, [previewDepositData]);

  const balance = formatEther(walletBalance?.value.toString() ?? "0");

  useEffect(() => {
    setWalletBalanceAmount(balance); // set wallet balance
  }, [address, status, walletBalance]);

  return (
    <div>
      {currentStep === WithdrawStep.WithdrawPage ? (
        <WithdrawPage
          walletBalanceAmount={walletBalanceAmount}
          amountError={amountError}
          setAmountError={setAmountError}
          minDepositAmount={minDepositAmount}
          withdrawAmount={withdrawAmount}
          setWithdrawAmount={setWithdrawAmount}
        />
      ) : null}
    </div>
  );
}
