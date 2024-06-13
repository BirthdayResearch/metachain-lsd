/**
 * Hook to write `requestRedeem` function
 */

import { useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useContractContext } from "@/context/ContractContext";
import { Abi, parseEther } from "viem";
import { WithdrawStep } from "@/types";

interface writeRequestRedeemI {
  address: string;
  withdrawAmount: string;
  setErrorMessage: any;
  setHasPendingTx: any;
  setCurrentStepAndScroll: any;
}

export default function useWriteRequestRedeem({
  address,
  withdrawAmount,
  setErrorMessage,
  setHasPendingTx,
  setCurrentStepAndScroll,
}: writeRequestRedeemI) {
  const { MarbleLsdProxy } = useContractContext();

  // Write contract for `requestRedeem` function
  const {
    data: hash,
    writeContract: writeRequestRedeem,
    error: writeRequestRedeemError,
  } = useWriteContract();

  // Wait and get result from write contract for `requestRedeem` function
  const {
    isSuccess: isRequestRedeemTxnSuccess,
    isLoading: isRequestRedeemTxnLoading,
    error: requestRedeemTxnError,
  } = useWaitForTransactionReceipt({
    hash: hash,
  });

  useEffect(() => {
    if (writeRequestRedeemError || requestRedeemTxnError) {
      setHasPendingTx(false);
      if (
        writeRequestRedeemError?.message?.includes("User rejected the request")
      ) {
        setErrorMessage(
          "The transaction was rejected in your wallet. Please retry your transaction.",
        );
      } else {
        setErrorMessage(
          writeRequestRedeemError?.message ?? requestRedeemTxnError?.message,
        );
      }
    }
  }, [writeRequestRedeemError, requestRedeemTxnError]);

  return {
    hash,
    isRequestRedeemTxnLoading,
    isRequestRedeemTxnSuccess,
    writeRequestRedeem: () => {
      writeRequestRedeem(
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
        },
      );
    },
  };
}
