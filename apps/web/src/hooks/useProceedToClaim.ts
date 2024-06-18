/**
 * Hook to write `claimWithdrawal` function
 */

import { useEffect, useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useContractContext } from "@/context/ContractContext";
import { Abi } from "viem";
import BigNumber from "bignumber.js";
import useGetWithdrawalDetails from "@/hooks/useGetWithdrawalDetails";

interface proceedToClaimI {
  setErrorMessage: any;
}

export default function useProceedToClaim({
  setErrorMessage,
}: proceedToClaimI) {
  const { MarbleLsdProxy } = useContractContext();
  const [withdrawalRequests, setWithdrawalRequests] = useState<BigNumber[]>([]);

  const { withdrawalRequestData } = useGetWithdrawalDetails();

  useEffect(() => {
    setWithdrawalRequests(withdrawalRequestData as BigNumber[]);
  }, [withdrawalRequestData]);

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
    withdrawalRequests,
    claimHash,
    isClaimWithdrawalsTxnLoading,
    isClaimWithdrawalsTxnSuccess,
    writeClaimWithdrawal: () => {
      writeClaimWithdrawal(
        {
          abi: MarbleLsdProxy.abi as Abi,
          address: MarbleLsdProxy.address,
          functionName: "claimWithdrawal",
          args: [withdrawalRequests[-1]],
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
