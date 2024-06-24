/**
 * Hook to write `claimWithdrawal` function
 */

import { useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useContractContext } from "@/context/ContractContext";
import { Abi } from "viem";

interface proceedToClaimI {
  requestId: string;
  setErrorMessage: any;
}

export default function useProceedToClaim({
  requestId,
  setErrorMessage,
}: proceedToClaimI) {
  const { MarbleLsdProxy } = useContractContext();

  // Write contract for `claimWithdrawals` function
  const {
    data: claimHash,
    writeContract: writeClaimWithdrawal,
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
          writeClaimWithdrawalError?.message ??
            ClaimWithdrawalsTxnError?.message,
        );
      }
    }
  }, [writeClaimWithdrawalError, ClaimWithdrawalsTxnError]);

  return {
    claimHash,
    isClaimWithdrawalsTxnLoading,
    isClaimWithdrawalsTxnSuccess,
    writeClaimWithdrawal: () => {
      writeClaimWithdrawal(
        {
          abi: MarbleLsdProxy.abi as Abi,
          address: MarbleLsdProxy.address,
          functionName: "claimWithdrawal",
          args: [requestId],
        },
        {
          onSuccess: (hash) => {
            if (hash) {
              console.log(hash);
            }
          },
        },
      );
    },
  };
}
