import { useContractContext } from "@/context/ContractContext";
import { useAccount, useReadContract } from "wagmi";
import { useEffect, useMemo, useState } from "react";

export interface WithdrawalStatusDataProps {
  requestId: string;
  amountOfAssets: BigInt;
  amountOfFees: BigInt;
  amountOfShares: BigInt;
  isClaimed: boolean;
  isFinalized: boolean;
  owner: string;
  receiver: string;
  timestamp: BigInt;
}

interface WithrawalDetailsProps {
  pendingWithdrawals: WithdrawalStatusDataProps[];
  confirmedWithdrawals: WithdrawalStatusDataProps[];
  withdrawalStatusWithReqId: WithdrawalStatusDataProps[];
}

export default function useGetWithdrawalDetails(): WithrawalDetailsProps {
  const { MarbleLsdProxy } = useContractContext();
  const { address, isConnected } = useAccount();

  const [pendingWithdrawals, setPendingWithdrawals] = useState<
    WithdrawalStatusDataProps[]
  >([]);
  const [confirmedWithdrawals, setConfirmedWithdrawals] = useState<
    WithdrawalStatusDataProps[]
  >([]);

  // read contract for 'getWithdrawalRequests' function
  const { data: withdrawalRequestData } = useReadContract({
    address: MarbleLsdProxy.address,
    abi: MarbleLsdProxy.abi,
    functionName: "getWithdrawalRequests",
    args: [address],
    query: {
      enabled: isConnected,
    },
  });

  // read contract for 'getWithdrawalStatus' function
  const { data: withdrawalStatusData } = useReadContract({
    address: MarbleLsdProxy.address,
    abi: MarbleLsdProxy.abi,
    functionName: "getWithdrawalStatus",
    args: [withdrawalRequestData],
    query: {
      enabled: isConnected,
    },
  });

  const withdrawalStatusWithReqId: WithdrawalStatusDataProps[] = useMemo(() => {
    if (
      Array.isArray(withdrawalStatusData) &&
      Array.isArray(withdrawalRequestData)
    ) {
      setConfirmedWithdrawals([]);
      setPendingWithdrawals([]);
      return withdrawalStatusData.map((item, index) => ({
        ...item,
        requestId: withdrawalRequestData[index],
      }));
    }
    return [];
  }, [withdrawalStatusData, withdrawalRequestData]);

  // To create pending and confirmed withdrawal arrays
  useEffect(() => {
    let pendingItems: WithdrawalStatusDataProps[] = [];
    let confirmedItems: WithdrawalStatusDataProps[] = [];
    if (Object.keys(withdrawalStatusWithReqId).length > 0) {
      withdrawalStatusWithReqId.map((item) => {
        if (!item.isClaimed && !item.isFinalized) {
          pendingItems.push(item);
        } else if (!item.isClaimed && item.isFinalized) {
          confirmedItems.push(item);
        }
      });
      setPendingWithdrawals([...pendingWithdrawals, ...pendingItems]);
      setConfirmedWithdrawals([...pendingWithdrawals, ...confirmedItems]);
    }
  }, [withdrawalStatusWithReqId]);

  return {
    pendingWithdrawals,
    confirmedWithdrawals,
    withdrawalStatusWithReqId,
  };
}
