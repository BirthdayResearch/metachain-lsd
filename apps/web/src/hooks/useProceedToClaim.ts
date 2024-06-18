/**
 * Hook to write `claimWithdrawals` function
 */

import { useEffect, useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
  useAccount,
} from "wagmi";
import { useContractContext } from "@/context/ContractContext";
import { Abi } from "viem";
import BigNumber from "bignumber.js";

interface proceedToClaimI {
  setErrorMessage: any;
}

export default function useProceedToClaim({
  setErrorMessage,
}: proceedToClaimI) {
  const { address, isConnected } = useAccount();
  const { MarbleLsdProxy } = useContractContext();
  const [withdrawalRequests, setWithdrawalRequests] = useState<BigNumber[]>([]);

  const { data: withdrawalRequestsData } = useReadContract({
    abi: MarbleLsdProxy.abi as Abi,
    address: MarbleLsdProxy.address,
    functionName: "getWithdrawalRequests",
    args: [address],
    query: {
      enabled: isConnected,
    },
  });

  useEffect(() => {
    setWithdrawalRequests(withdrawalRequestsData as BigNumber[]);
  }, [withdrawalRequestsData]);

  // Write contract for `claimWithdrawals` function
  const {
    data: claimHash,
    writeContract: writeClaimWithdrawals,
    error: writeClaimWithdrawalsError,
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
    if (writeClaimWithdrawalsError || ClaimWithdrawalsTxnError) {
      if (
        writeClaimWithdrawalsError?.message?.includes(
          "User rejected the request",
        )
      ) {
        setErrorMessage(
          "The transaction was rejected in your wallet. Please retry your transaction.",
        );
      } else {
        setErrorMessage(
          writeClaimWithdrawalsError?.message ??
            ClaimWithdrawalsTxnError?.message,
        );
      }
    }
  }, [writeClaimWithdrawalsError, ClaimWithdrawalsTxnError]);

  return {
    withdrawalRequests,
    claimHash,
    isClaimWithdrawalsTxnLoading,
    isClaimWithdrawalsTxnSuccess,
    writeClaimWithdrawals: () => {
      writeClaimWithdrawals(
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
