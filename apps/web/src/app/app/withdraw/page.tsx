"use client";

import { useAccount, useReadContract } from "wagmi";
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
import WithdrawalConfirmation from "@/app/app/withdraw/components/WithdrawalConfirmation";

import BigNumber from "bignumber.js";
import useWriteRequestRedeem from "@/hooks/useWriteRequestRedeem";
import useApproveAllowance from "@/hooks/useApproveAllowance";

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

  const isWithdrawalPaused = useMemo(() => {
    return (isWithdrawalPausedData as boolean) ?? false;
  }, [isWithdrawalPausedData]);

  const resetFields = () => {
    setWithdrawAmount("");
    setAmountError(null);
    setRequireApproval(false);
  };

  const {
    hash,
    isRequestRedeemTxnLoading,
    isRequestRedeemTxnSuccess,
    writeRequestRedeem,
  } = useWriteRequestRedeem({
    address: address as string,
    withdrawAmount: withdrawAmount,
    setErrorMessage,
    setHasPendingTx,
    setCurrentStepAndScroll,
  });

  const {
    allowance,
    writeApproveStatus,
    isApproveTxnLoading,
    isApproveTxnSuccess,
    isApprovalRequired,
    writeApprove,
  } = useApproveAllowance({
    setErrorMessage,
    setHasPendingTx,
  });

  const handleInitiateTransfer = async () => {
    setHasPendingTx(true);

    // Verify the approved allowance for an Ethereum address to spend tokens on a contract
    if (await isApprovalRequired(withdrawAmtBigNum)) {
      setRequireApproval(true);
      writeApprove(withdrawAmtBigNum);
      return;
    }

    // If there's sufficient approved allowance, proceed with redeem
    writeRequestRedeem();
  };

  useEffect(() => {
    if (!isApproveTxnSuccess) {
      if (allowance.lt(withdrawAmtBigNum)) {
        setRequireApproval(true);
      } else {
        setRequireApproval(false);
      }
    }
  }, [allowance, withdrawAmtBigNum, isApproveTxnSuccess]);

  useEffect(() => {
    if (isApproveTxnLoading) {
      toast("Approve transaction is loading", {
        icon: <CgSpinner size={24} className="animate-spin text-green" />,
        duration: Infinity,
        className:
          "bg-green px-2 py-1 !text-sm !text-light-00 !bg-dark-00 mt-10 !px-6 !py-4 !rounded-md",
        id: "approve",
      });
    }

    // cleanup
    return () => toast.remove("approve");
  }, [isApproveTxnLoading]);

  useEffect(() => {
    if (writeApproveStatus === "pending") {
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
  }, [writeApproveStatus]);

  useEffect(() => {
    if (errorMessage) {
      toast(errorMessage, {
        duration: 5000,
        className:
          "!bg-light-900 px-2 py-1 !text-xs !text-light-00 mt-10 !rounded-md",
        id: "errorMessage",
      });
    }
    // cleanup
    return () => toast.remove("errorMessage");
  }, [errorMessage]);

  useEffect(() => {
    if (requireApproval && isApproveTxnSuccess) {
      setRequireApproval(false);
      writeRequestRedeem();
    }
  }, [requireApproval, isApproveTxnLoading, isApproveTxnSuccess]);

  useEffect(() => {
    if (
      isRequestRedeemTxnSuccess &&
      currentStep !== WithdrawStep.WithdrawConfirmationPage
    ) {
      // to schedule component change only after toast is removed
      setTimeout(() => {
        setCurrentStepAndScroll(WithdrawStep.WithdrawConfirmationPage);
        setHasPendingTx(false);
      }, 0);
    }
  }, [isRequestRedeemTxnSuccess]);

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
                isRequestRedeemTxnLoading ||
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
