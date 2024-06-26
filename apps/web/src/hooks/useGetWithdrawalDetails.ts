import { useContractContext } from "@/context/ContractContext";
import { useAccount, useReadContract } from "wagmi";
import { useEffect, useMemo, useState } from "react";

interface WithdrawalStatusDataProps {
  amountOfAssets: BigInt;
  amountOfFees: BigInt;
  amountOfShares: BigInt;
  isClaimed: boolean;
  isFinalized: boolean;
  owner: string;
  receiver: string;
  timestamp: BigInt;
  id: number;
}

interface WithrawalDetailsProps {
  pendingWithdrawalsArray: WithdrawalStatusDataProps[];
  confirmedWithdrawalsArray: WithdrawalStatusDataProps[];
  withdrawalStatusWithReqId: WithdrawalStatusDataProps[];
}

export default function useGetWithdrawalDetails(): WithrawalDetailsProps {
  const { MarbleLsdProxy } = useContractContext();
  const { address } = useAccount();

  const [pendingWithdrawalsArray, setPendingWithdrawalsArray] = useState<
    WithdrawalStatusDataProps[]
  >([]);
  const [confirmedWithdrawalsArray, setConfirmedWithdrawalsArray] = useState<
    WithdrawalStatusDataProps[]
  >([]);

  // read contract for 'getWithdrawalRequests' function to get list of reqyest IDs
  const { data: withdrawalRequestData } = useReadContract({
    address: MarbleLsdProxy.address,
    abi: MarbleLsdProxy.abi,
    functionName: "getWithdrawalRequests",
    args: [address],
  });

  // read contract for 'getWithdrawalStatus' function
  const { data: withdrawalStatusData } = useReadContract({
    address: MarbleLsdProxy.address,
    abi: MarbleLsdProxy.abi,
    functionName: "getWithdrawalStatus",
    args: [withdrawalRequestData],
  });

  const withdrawalStatusWithReqId: WithdrawalStatusDataProps[] = useMemo(() => {
    let withdrawalStatusWithReqId: WithdrawalStatusDataProps[] = [];
    if (
      Array.isArray(withdrawalStatusData) &&
      Array.isArray(withdrawalRequestData)
    ) {
      withdrawalStatusData.map((item, index) => {
        withdrawalStatusWithReqId.push({
          ...item,
          id: withdrawalRequestData[index], // id
        });
      });
    }
    return withdrawalStatusWithReqId;
  }, [withdrawalStatusData, withdrawalRequestData]);

  // To create pending and confirmed withdrawal arrays
  useEffect(() => {
    let pendingItems: WithdrawalStatusDataProps[] = [];
    let confirmedItems: WithdrawalStatusDataProps[] = [];
    if (
      Array.isArray(withdrawalStatusWithReqId) &&
      Object.keys(withdrawalStatusWithReqId).length > 0
    ) {
      withdrawalStatusWithReqId.map((item) => {
        if (!item.isClaimed && !item.isFinalized) {
          pendingItems.push(item);
        } else if (!item.isClaimed && item.isFinalized) {
          confirmedItems.push(item);
        }
      });
      setPendingWithdrawalsArray([...pendingWithdrawalsArray, ...pendingItems]);
      setConfirmedWithdrawalsArray([
        ...pendingWithdrawalsArray,
        ...confirmedItems,
      ]);
    }
  }, [withdrawalStatusWithReqId]);

  return {
    pendingWithdrawalsArray,
    confirmedWithdrawalsArray,
    withdrawalStatusWithReqId,
  };
}
