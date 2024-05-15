import { useContractContext } from "@/context/ContractContext";
import { useAccount, useReadContracts } from "wagmi";
import { formatEther, parseEther } from "ethers";

export function useGetReadContractConfigs(): {
  mDfiToDfiConversion: string;
  isDepositPaused: boolean;
  minDepositAmount: string;
} {
  const { isConnected } = useAccount();
  const { MarbleLsdProxy } = useContractContext();

  const { data: contractResponse } = useReadContracts({
    contracts: [
      {
        address: MarbleLsdProxy.address,
        abi: MarbleLsdProxy.abi,
        functionName: "isDepositPaused",
      },
      {
        address: MarbleLsdProxy.address,
        abi: MarbleLsdProxy.abi,
        functionName: "convertToAssets",
        args: [parseEther("1")],
      },
      {
        address: MarbleLsdProxy.address,
        abi: MarbleLsdProxy.abi,
        functionName: "minDeposit",
        args: [],
      },
    ],
    query: {
      enabled: isConnected,
    },
  });

  const [depositPausedData, convertToAssetsData, minDepositData] =
    contractResponse ?? [];
  const mDfiToDfiConversion = formatEther(
    (convertToAssetsData?.result as number) ?? 0,
  ).toString();
  const isDepositPaused = !!depositPausedData?.result;
  const minDepositAmount = formatEther(
    (minDepositData?.result as number) ?? 0,
  ).toString();
  return {
    mDfiToDfiConversion,
    isDepositPaused,
    minDepositAmount,
  };
}
