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
  withdrawalStatusData: WithdrawalStatusDataProps[] | undefined;
  pendingWithdrawalsArray: WithdrawalStatusDataProps[];
  confirmedWithdrawalsArray: WithdrawalStatusDataProps[];
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

  // read contract for 'getWithdrawalRequests' function
  const { data: withdrawalRequestData } = useReadContract({
    address: MarbleLsdProxy.address,
    abi: MarbleLsdProxy.abi,
    functionName: "getWithdrawalRequests",
    args: [address],
  });

  // read contract for 'getWithdrawalStatus' function
  const { data: withdrawalStatusDataRaw } = useReadContract({
    address: MarbleLsdProxy.address,
    abi: MarbleLsdProxy.abi,
    functionName: "getWithdrawalStatus",
    args: [withdrawalRequestData],
  });

  const withdrawalStatusData = Array.isArray(withdrawalStatusDataRaw)
    ? withdrawalStatusDataRaw
    : undefined;

  let withdrawalStatusDataWithReqId: WithdrawalStatusDataProps[];

  const withdrawalRequest = useMemo(() => {
    return withdrawalRequestData as string[];
  }, [withdrawalRequestData]);

  if (withdrawalStatusData) {
    withdrawalStatusDataWithReqId = withdrawalRequest.map((key, index) => ({
      requestId: key,
      ...withdrawalStatusData[index],
    }));
  }

  // To create pending and confirmed withdrawal arrays
  useEffect(() => {
    let pendingItems: WithdrawalStatusDataProps[] = [];
    let confirmedItems: WithdrawalStatusDataProps[] = [];
    if (
      Array.isArray(withdrawalStatusData) &&
      Object.keys(withdrawalStatusData).length > 0
    ) {
      withdrawalStatusDataWithReqId.map((item) => {
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
  }, [withdrawalStatusData]);

  return {
    pendingWithdrawalsArray,
    confirmedWithdrawalsArray,
    withdrawalStatusData,
  };
}
