import { useContractContext } from "@/context/ContractContext";
import { useAccount, useReadContract } from "wagmi";

export default function useGetWithdrawalDetails() {
  const { MarbleLsdProxy, mDFI } = useContractContext();
  // const { address } = useAccount();
  const address = "0xFB9DCeCBb49fA49cc2692A6A4A160fd6071b85b2";

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
