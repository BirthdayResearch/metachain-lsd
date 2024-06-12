/**
 * Hook to write `approve` function
 */

import { useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useContractContext } from "@/context/ContractContext";
import { Abi, parseEther } from "viem";

interface WriteApproveI {
  withdrawAmount: string;
  setErrorMessage: any;
  setHasPendingTx: any;
}

export default function useWriteApprove({
  withdrawAmount,
  setErrorMessage,
  setHasPendingTx,
}: WriteApproveI) {
  const { MarbleLsdProxy, mDFI } = useContractContext();

  // Write contract for `approve` function
  const {
    data: tokenContractData,
    status: writeApproveStatus,
    writeContract: writeApprove,
    error: writeApproveError,
  } = useWriteContract();

  // Wait and get result from write contract for `approve` function
  const {
    isSuccess: isApproveTxnSuccess,
    isLoading: isApproveTxnLoading,
    error: approveTxnError,
  } = useWaitForTransactionReceipt({
    hash: tokenContractData,
  });

  useEffect(() => {
    if (writeApproveError || approveTxnError) {
      setHasPendingTx(false);
      if (writeApproveError?.message?.includes("User rejected the request")) {
        setErrorMessage(
          "The transaction was rejected in your wallet. No funds have been approved. Please retry your transaction.",
        );
      } else {
        setErrorMessage(writeApproveError?.message ?? approveTxnError?.message);
      }
    }
  }, [writeApproveError, approveTxnError]);

  return {
    writeApproveStatus,
    isApproveTxnLoading,
    isApproveTxnSuccess,
    writeApprove: () => {
      writeApprove({
        abi: mDFI.abi as Abi,
        address: mDFI.address,
        functionName: "approve",
        args: [MarbleLsdProxy.address, parseEther(withdrawAmount)],
      });
    },
  };
}
