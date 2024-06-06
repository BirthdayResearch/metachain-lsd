"use client";

import { useAccount, useReadContract, useWriteContract } from "wagmi";
import React, { useEffect, useMemo, useState } from "react";
import { formatEther } from "ethers";
import { toWei } from "@/lib/textHelper";
import { useContractContext } from "@/context/ContractContext";
import { useDfiPrice } from "@/hooks/useDfiPrice";
import PausedWithdrawalsPage from "@/app/app/withdraw/components/PausedWithdrawalsPage";
import { WithdrawStep } from "@/types";
import WithdrawPage from "@/app/app/withdraw/components/WithdrawPage";
import PreviewWithdrawal from "@/app/app/withdraw/components/PreviewWithdrawal";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { Abi, parseEther } from "viem";

/*
 * Withdrawal flow
 * The term 'redeem' is used for withdrawing mDFI shares from the vault
 * Future: The term 'withdraw' is used for withdrawing DFI assets from the vault
 */

export default function Withdraw() {
  const mainContentRef = React.useRef(null);
  const { address, isConnected } = useAccount();
  const { MarbleLsdProxy } = useContractContext();

  const [amountError, setAmountError] = useState<string | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [walletBalanceAmount, setWalletBalanceAmount] = useState<string>("");
  // To display /withdraw pages based on the current step
  const [currentStep, setCurrentStep] = useState<WithdrawStep>(
    WithdrawStep.WithdrawPage,
  );

  // To prevent calling contract with invalid number (too large or too small)
  const validAmount = withdrawAmount !== "" && !amountError;
  const withdrawAmountString = validAmount ? withdrawAmount : "0";

  const { data: previewRedeemData } = useReadContract({
    address: MarbleLsdProxy.address,
    abi: MarbleLsdProxy.abi,
    functionName: "previewRedeem",
    args: [toWei(withdrawAmountString)],
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

  const previewRedeem = useMemo(() => {
    return formatEther((previewRedeemData as number) ?? 0).toString();
  }, [previewRedeemData]);

  const setCurrentStepAndScroll = (step: WithdrawStep) => {
    setCurrentStep(step);
    if (mainContentRef.current) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const { data: isWithdrawalPausedData, isLoading } = useReadContract({
    address: MarbleLsdProxy.address,
    abi: MarbleLsdProxy.abi,
    functionName: "isWithdrawalPaused",
    query: {
      enabled: isConnected,
    },
  });

  const isWithdrawalPaused = useMemo(() => {
    return (isWithdrawalPausedData as boolean) ?? false;
  }, [isWithdrawalPausedData]);

  const resetFields = () => {
    setWithdrawAmount("");
    setAmountError(null);
  };

  function submitWithdraw() {
    if (!amountError) {
      writeContract(
        {
          abi: MarbleLsdProxy.abi as Abi,
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
  return (
    <>
      {!isWithdrawalPaused && !isLoading ? (
        <div>
          {currentStep === WithdrawStep.WithdrawPage ? (
            <WithdrawPage
              walletBalanceAmount={walletBalanceAmount}
              amountError={amountError}
              setAmountError={setAmountError}
              withdrawAmount={withdrawAmount}
              setWithdrawAmount={setWithdrawAmount}
              setWalletBalanceAmount={setWalletBalanceAmount}
              isPending={isPending}
              submitWithdraw={submitWithdraw}
              previewRedeem={previewRedeem}
            />
          ) : null}

          {currentStep === WithdrawStep.PreviewWithdrawal
            ? address &&
              hash && (
                <PreviewWithdrawal
                  withdrawAmount={withdrawAmount}
                  previewWithdrawal={previewRedeem}
                  setCurrentStep={setCurrentStepAndScroll}
                  hash={hash}
                  receivingWalletAddress={address}
                  resetFields={resetFields}
                />
              )
            : null}
        </div>
      ) : (
        <PausedWithdrawalsPage />
      )}
    </>
  );
}
