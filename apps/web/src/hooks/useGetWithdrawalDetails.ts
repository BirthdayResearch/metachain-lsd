import { useContractContext } from "@/context/ContractContext";
import { useAccount, useReadContract } from "wagmi";

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
  withdrawalRequestData: unknown;
  withdrawalStatusData: unknown | WithdrawalStatusDataProps[];
  withdrawalRequestError: unknown;
  withdrawalStatusError: unknown;
}

export default function useGetWithdrawalDetails(): WithrawalDetailsProps {
  const { MarbleLsdProxy, mDFI } = useContractContext();
  // const { address } = useAccount();
  const address = "0xFB9DCeCBb49fA49cc2692A6A4A160fd6071b85b2"; // TODO change back to account

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

  return {
    withdrawalRequestData,
    withdrawalStatusData,
    withdrawalRequestError,
    withdrawalStatusError,
  };
}
