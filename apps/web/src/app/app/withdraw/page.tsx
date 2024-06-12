"use client";

import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import React, { useEffect, useMemo, useState } from "react";
import { formatEther } from "ethers";
import { toWei } from "@/lib/textHelper";
import { useContractContext } from "@/context/ContractContext";
import PausedWithdrawalsPage from "@/app/app/withdraw/components/PausedWithdrawalsPage";
import { WithdrawStep } from "@/types";
import WithdrawPage from "@/app/app/withdraw/components/WithdrawPage";
import PreviewWithdrawal from "@/app/app/withdraw/components/PreviewWithdrawal";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { Abi, parseEther } from "viem";
import WithdrawalConfirmation from "@/app/app/withdraw/components/WithdrawalConfirmation";

import BigNumber from "bignumber.js";
/*
 * Withdrawal flow
 * The term 'redeem' is used for withdrawing mDFI shares from the vault
 * Future: The term 'withdraw' is used for withdrawing DFI assets from the vault
 */

export default function Withdraw() {
  const mainContentRef = React.useRef(null);
  const { address, isConnected } = useAccount();
  const { MarbleLsdProxy, mDFI } = useContractContext();

  const [amountError, setAmountError] = useState<string | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [walletBalanceAmount, setWalletBalanceAmount] = useState<string>("");
  // To display /withdraw pages based on the current step
  const [currentStep, setCurrentStep] = useState<WithdrawStep>(
    WithdrawStep.WithdrawPage,
  );
  const [hasPendingTx, setHasPendingTx] = useState(false);
  const [requireApproval, setRequireApproval] = useState(false);

  // To prevent calling contract with invalid number (too large or too small)
  const validAmount = withdrawAmount !== "" && !amountError;
  const withdrawAmountString = validAmount ? withdrawAmount : "0";

  const withdrawAmtBigNum = useMemo(() => {
    return new BigNumber(withdrawAmount);
  }, [withdrawAmount]);

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

  const { data: isWithdrawalPausedData, isLoading: isWithdrawalPausedLoading } =
    useReadContract({
      address: MarbleLsdProxy.address,
      abi: MarbleLsdProxy.abi,
      functionName: "isWithdrawalPaused",
      query: {
        enabled: isConnected,
      },
    });

  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    address: mDFI.address,
    abi: mDFI.abi,
    functionName: "allowance",
    args: [address, MarbleLsdProxy.address],
    query: {
      enabled: isConnected,
    },
  });

  const allowance = useMemo(() => {
    return new BigNumber(formatEther((allowanceData as number) ?? 0));
  }, [allowanceData]);

  const { data: tokenContractData, writeContract: writeApprove } =
    useWriteContract();

  const { isSuccess: isApproveTxnSuccess, isLoading: isApproveTxnLoading } =
    useWaitForTransactionReceipt({
      hash: tokenContractData,
    });

  useEffect(() => {
    if (!isApproveTxnSuccess) {
      if (allowance.lt(withdrawAmtBigNum)) {
        setRequireApproval(true);
      } else {
        setRequireApproval(false);
      }
    }
  }, [allowance, withdrawAmtBigNum, isApproveTxnSuccess]);

  const isWithdrawalPaused = useMemo(() => {
    return (isWithdrawalPausedData as boolean) ?? false;
  }, [isWithdrawalPausedData]);

  const resetFields = () => {
    setWithdrawAmount("");
    setAmountError(null);
    setRequireApproval(false);
  };

  function approve() {
    writeApprove({
      abi: mDFI.abi as Abi,
      address: mDFI.address,
      functionName: "approve",
      args: [MarbleLsdProxy.address, parseEther(withdrawAmount)],
    });
  }

  function requestRedeem() {
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
            console.log(hash);
            setCurrentStepAndScroll(WithdrawStep.PreviewWithdrawal);
          }
        },
      },
    );
  }

  const handleInitiateTransfer = async () => {
    setHasPendingTx(true);

    // Refetch token allowance
    const { data: refetchedData } = await refetchAllowance();
    const refetchedAllowance = new BigNumber(
      formatEther((refetchedData as number) ?? 0),
    );
    console.log({ refetchedData: refetchedAllowance.toString() });
    console.log(refetchedAllowance.lt(withdrawAmtBigNum));
    if (refetchedAllowance.lt(withdrawAmtBigNum)) {
      console.log("Here");
      setRequireApproval(true);
      approve();
      return;
    }

    // If no approval required, perform requestRedeem function directly
    requestRedeem();
  };
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

  useEffect(() => {
    if (requireApproval && isApproveTxnSuccess) {
      setRequireApproval(false);
      requestRedeem();
    }
  }, [requireApproval, isApproveTxnLoading, isApproveTxnSuccess]);

  return (
    <>
      {!isWithdrawalPaused && !isWithdrawalPausedLoading && (
        <div>
          {currentStep === WithdrawStep.WithdrawPage && (
            <WithdrawPage
              walletBalanceAmount={walletBalanceAmount}
              amountError={amountError}
              setAmountError={setAmountError}
              withdrawAmount={withdrawAmount}
              setWithdrawAmount={setWithdrawAmount}
              setWalletBalanceAmount={setWalletBalanceAmount}
              isPending={
                isPending ||
                (requireApproval && isApproveTxnLoading) ||
                hasPendingTx
              }
              submitWithdraw={handleInitiateTransfer}
              previewRedeem={previewRedeem}
            />
          )}

          {currentStep === WithdrawStep.PreviewWithdrawal &&
            address &&
            hash && (
              <PreviewWithdrawal
                withdrawAmount={withdrawAmount}
                amountToReceive={previewRedeem}
                setCurrentStep={setCurrentStepAndScroll}
                hash={hash}
                receivingWalletAddress={address}
                resetFields={resetFields}
              />
            )}

          {currentStep === WithdrawStep.WithdrawConfirmationPage &&
            address &&
            hash && (
              <WithdrawalConfirmation
                withdrawAmount={withdrawAmount}
                amountToReceive={previewRedeem}
                setCurrentStep={setCurrentStepAndScroll}
                hash={hash}
                receivingWalletAddress={address}
                resetFields={resetFields}
              />
            )}
        </div>
      )}

      {isWithdrawalPaused && <PausedWithdrawalsPage />}
      {/* TODO: Uncomment once data is not hardcoded */}
      {/* <ComplimentarySection /> */}
    </>
  );
}
