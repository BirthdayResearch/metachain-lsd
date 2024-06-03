"use client";

import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
} from "wagmi";
import React, { useEffect, useMemo, useState } from "react";
import { formatEther } from "ethers";
import { useGetReadContractConfigs } from "@/hooks/useGetReadContractConfigs";
import { toWei } from "@/lib/textHelper";
import { useContractContext } from "@/context/ContractContext";
import { WithdrawStep } from "@/types";
import WithdrawPage from "@/app/app/withdraw/components/WithdrawPage";
import PreviewWithdrawal from "@/app/app/withdraw/components/PreviewWithdrawal";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { parseEther } from "viem";

export default function Withdraw() {
  const mainContentRef = React.useRef(null);
  const { address, isConnected, chainId } = useAccount();
  const { MarbleLsdProxy } = useContractContext();

  const { minDepositAmount } = useGetReadContractConfigs();

  const [amountError, setAmountError] = useState<string | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [walletBalanceAmount, setWalletBalanceAmount] = useState<string>("");
  // To display /withdraw pages based on the current step
  const [currentStep, setCurrentStep] = useState<WithdrawStep>(
    WithdrawStep.WithdrawPage,
  );
  const { data: previewWithdrawalData } = useReadContract({
    address: MarbleLsdProxy.address,
    abi: MarbleLsdProxy.abi,
    functionName: "previewRedeem",
    args: [toWei(withdrawAmount !== "" ? withdrawAmount : "0")],
    query: {
      enabled: isConnected,
    },
  });

  const {
    data: hash,
    isPending,
    writeContract,
    status: writeStatus,
  } = useWriteContract();

  const previewWithdrawal = useMemo(() => {
    return formatEther((previewWithdrawalData as number) ?? 0).toString();
  }, [previewWithdrawalData]);
  console.log({ previewWithdrawalData });

  const setCurrentStepAndScroll = (step: WithdrawStep) => {
    setCurrentStep(step);
    if (mainContentRef.current) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const resetFields = () => {
    setWithdrawAmount("");
    setAmountError(null);
  };

  function submitWithdraw() {
    if (!amountError) {
      writeContract(
        {
          abi: MarbleLsdProxy.abi,
          address: MarbleLsdProxy.address,
          functionName: "requestRedeem",
          args: [parseEther(withdrawAmount), address as string],
        },
        {
          onSuccess: (hash) => {
            if (hash) {
              setCurrentStepAndScroll(WithdrawStep.PreviewWithdrawal);
            }
          },
          onError: (error) => {
            console.log({ error });
          },
        },
      );
    }
  }
  useEffect(() => {
    if (writeStatus === "pending") {
      toast("Confirm transaction on your wallet.", {
        icon: <CgSpinner size={24} className="animate-spin text-green" />,
        duration: Infinity,
        className:
          "bg-green px-2 py-1 !text-sm !text-light-00 !bg-dark-00 mt-10 !px-6 !py-4 !rounded-md",
        id: "withdraw",
      });
    }

    // cleanup
    return () => toast.remove("withdraw");
  }, [writeStatus]);
  console.log({ withdrawAmount });
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
          setWalletBalanceAmount={setWalletBalanceAmount}
          isPending={isPending}
          submitWithdraw={submitWithdraw}
        />
      ) : null}

      {currentStep === WithdrawStep.PreviewWithdrawal
        ? address &&
          hash && (
            <PreviewWithdrawal
              withdrawAmount={withdrawAmount}
              previewWithdrawal={previewWithdrawal}
              setCurrentStep={setCurrentStepAndScroll}
              hash={hash}
              receivingWalletAddress={address}
              resetFields={resetFields}
            />
          )
        : null}
    </div>
  );
}
