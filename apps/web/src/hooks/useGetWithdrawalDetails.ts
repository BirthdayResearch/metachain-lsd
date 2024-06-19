import { useContractContext } from "@/context/ContractContext";
import { useAccount, useReadContract } from "wagmi";
import { useEffect, useState } from "react";
import { formatEther } from "ethers";

interface WithdrawalStatusDataProps {
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
  pendingWithdrawalsArray: WithdrawalStatusDataProps[];
  confirmedWithdrawalsArray: WithdrawalStatusDataProps[];
}

export default function useGetWithdrawalDetails(): WithrawalDetailsProps {
  const { MarbleLsdProxy, mDFI } = useContractContext();
  const { ownAddress } = useAccount();
  const address = "0xFB9DCeCBb49fA49cc2692A6A4A160fd6071b85b2"; // TODO change back to account

  const [pendingWithdrawalsArray, setPendingWithdrawalsArray] = useState<
    WithdrawalStatusDataProps[]
  >([]);
  const [confirmedWithdrawalsArray, setConfirmedWithdrawalsArray] = useState<
    WithdrawalStatusDataProps[]
  >([]);

  // read contract for 'getWithdrawalRequests' function
  const { data: withdrawalRequestData, error: withdrawalRequestError } =
    useReadContract({
      address: MarbleLsdProxy.address,
      abi: MarbleLsdProxy.abi,
      functionName: "getWithdrawalRequests",
      args: [address],
    });

  // read contract for 'getWithdrawalStatus' function
  const { data: withdrawalStatusData, error: withdrawalStatusError } =
    useReadContract({
      address: MarbleLsdProxy.address,
      abi: MarbleLsdProxy.abi,
      functionName: "getWithdrawalStatus",
      args: [withdrawalRequestData],
    });

  useEffect(() => {
    let pendingItems: WithdrawalStatusDataProps[] = [];
    let confirmedItems: WithdrawalStatusDataProps[] = [];
    if (
      Array.isArray(withdrawalStatusData) &&
      Object.keys(withdrawalStatusData).length > 0
    ) {
      withdrawalStatusData.map((item) => {
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
  };
}
