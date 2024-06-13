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
import { Abi, parseEther } from "viem";
import BigNumber from "bignumber.js";

interface proceedToClaimI {
  withdrawAmount: string;
  setErrorMessage: any;
}

export default function useProceedToClaim({
  withdrawAmount,
  setErrorMessage,
}: proceedToClaimI) {
  const { address, isConnected } = useAccount();
  const { MarbleLsdProxy, mDFI } = useContractContext();
  const [withdrawalRequests, setWithdrawalRequests] = useState<BigNumber[]>();

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
    // setWithdrawalRequests(withdrawalRequestsData);
  }, [withdrawalRequestsData]);

  // Write contract for `claimWithdrawals` function
  const {
    data: hash,
    writeContract: writeClaimWithdrawals,
    error: writeClaimWithdrawalsError,
  } = useWriteContract();

  // Wait and get result from write contract for `claimWithdrawals` function
  const {
    isSuccess: isClaimWithdrawalsTxnSuccess,
    isLoading: isClaimWithdrawalsTxnLoading,
    error: ClaimWithdrawalsTxnError,
  } = useWaitForTransactionReceipt({
    hash: hash,
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
    hash,
    isClaimWithdrawalsTxnLoading,
    isClaimWithdrawalsTxnSuccess,
    writeClaimWithdrawals: () => {
      writeClaimWithdrawals(
        {
          abi: MarbleLsdProxy.abi as Abi,
          address: MarbleLsdProxy.address,
          functionName: "claimWithdrawals",
          args: [parseEther(withdrawAmount), address as string],
        },
        {
          onSuccess: (hash) => {
            if (hash) {
              console.log(hash);
              // setCurrentStepAndScroll(WithdrawStep.PreviewWithdrawal);
            }
          },
        },
      );
    },
  };
}
