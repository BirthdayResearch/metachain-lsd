import { useEffect, useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import BigNumber from "bignumber.js";
import { Abi, parseEther } from "viem";
import { formatEther } from "ethers";

import { useContractContext } from "@/context/ContractContext";

interface ApproveAllowanceI {
  setErrorMessage: any;
  setHasPendingTx: any;
}

export default function useApproveAllowance({
  setErrorMessage,
  setHasPendingTx,
}: ApproveAllowanceI) {
  const { MarbleLsdProxy, mDFI } = useContractContext();
  const { address, isConnected } = useAccount();

  const [allowance, setAllowance] = useState(new BigNumber(0));
  const [isApprovalRequested, setIsApprovalRequested] = useState(false);

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

  const { data: allowanceData, refetch: refetchAllowanceContract } =
    useReadContract({
      address: mDFI.address,
      abi: mDFI.abi,
      functionName: "allowance",
      args: [address, MarbleLsdProxy.address],
      query: {
        enabled: isConnected,
      },
    });

  const refetchAllowance = async (): Promise<BigNumber> => {
    const { data: refetchedData } = await refetchAllowanceContract();
    const refetchedAllowance = new BigNumber(
      formatEther((refetchedData as number) ?? 0),
    );

    setAllowance(refetchedAllowance);

    return allowance;
  };

  const checkSufficientAllowance = async (withdrawAmount: BigNumber) => {
    // Refetched to ensure latest value
    const allowance = await refetchAllowance();
    const allowanceForApproval = withdrawAmount.minus(allowance);

    return allowanceForApproval.lte(0);
  };

  useEffect(() => {
    setAllowance(new BigNumber(formatEther((allowanceData as number) ?? 0)));
  }, [allowanceData]);

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
    isApprovalRequested,
    checkSufficientAllowance,
    setIsApprovalRequested,
    requestAllowance: (withdrawAmount: BigNumber) => {
      const allowanceForApproval = withdrawAmount.minus(allowance);

      if (allowanceForApproval.lte(0)) {
        console.log(
          "Allowance is already sufficient or exceeds the withdraw amount",
        );
        return;
      }

      setIsApprovalRequested(true);

      writeApprove({
        abi: mDFI.abi as Abi,
        address: mDFI.address,
        functionName: "approve",
        args: [MarbleLsdProxy.address, parseEther(withdrawAmount.toString())],
      });
    },
  };
}
