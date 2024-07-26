/**
 * Hook to write `claimWithdrawal` function
 */

import { useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useContractContext } from "@/context/ContractContext";
import { Abi } from "viem";
import { WithdrawStep } from "@/types";

interface proceedToClaimI {
  setErrorMessage: (message: string | null) => void;
  setCurrentStepAndScroll: (step: WithdrawStep) => void;
  onSuccess?: (hash: string) => void;
}

export default function useProceedToClaim({
  setErrorMessage,
  setCurrentStepAndScroll,
  onSuccess,
}: proceedToClaimI) {
  const { MarbleLsdProxy } = useContractContext();

  // Write contract for `claimWithdrawals` function
  const {
    data: claimHash,
    writeContract: writeClaimWithdrawal,
    isPending: isClaimRequestPending,
    error: writeClaimWithdrawalError,
  } = useWriteContract();

  // Wait and get result from write contract for `claimWithdrawals` function
  const {
    isSuccess: isClaimWithdrawalsTxnSuccess,
    isLoading: isClaimWithdrawalsTxnLoading,
    error: ClaimWithdrawalsTxnError,
  } = useWaitForTransactionReceipt({
    hash: claimHash,
  });

  useEffect(() => {
    if (writeClaimWithdrawalError || ClaimWithdrawalsTxnError) {
      if (
        writeClaimWithdrawalError?.message?.includes(
          "User rejected the request",
        )
      ) {
        setErrorMessage(
          "The transaction was rejected in your wallet. Please retry your transaction.",
        );
      } else {
        setErrorMessage(
          (writeClaimWithdrawalError?.message as string) ??
            (ClaimWithdrawalsTxnError?.message as string),
        );
      }
    }
  }, [writeClaimWithdrawalError, ClaimWithdrawalsTxnError]);

  return {
    claimHash,
    isClaimRequestPending,
    isClaimWithdrawalsTxnLoading,
    isClaimWithdrawalsTxnSuccess,
    writeClaimWithdrawal: (requestIds: string[]) => {
      writeClaimWithdrawal(
        {
          abi: MarbleLsdProxy.abi as Abi,
          address: MarbleLsdProxy.address,
          functionName: "claimWithdrawals",
          args: [requestIds],
        },
        {
          onSuccess: (hash) => {
            if (hash) {
              if (onSuccess) {
                onSuccess(hash);
              } else {
                if (setCurrentStepAndScroll) {
                  setCurrentStepAndScroll(WithdrawStep.ClaimConfirmationPage);
                }
              }
            }
          },
        },
      );
    },
  };
}
