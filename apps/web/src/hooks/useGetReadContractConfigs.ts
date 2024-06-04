import { useContractContext } from "@/context/ContractContext";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { formatEther, parseEther } from "ethers";
import { useMemo } from "react";
import BigNumber from "bignumber.js";
import { useDfiPrice } from "@/hooks/useDfiPrice";

export function useGetReadContractConfigs(): {
  mDfiToDfiConversion: string;
  isDepositPaused: boolean;
  minDepositAmount: string;
  totalAssets: string;
  totalAssetsUsdAmount: BigNumber;
} {
  const { isConnected } = useAccount();
  const { MarbleLsdProxy } = useContractContext();
  const dfiPrice = useDfiPrice();

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

  const { data: totalAssetsData } = useReadContract({
    address: MarbleLsdProxy.address,
    abi: MarbleLsdProxy.abi,
    functionName: "totalAssets",
    query: {
      enabled: isConnected,
    },
  });

  const totalAssets = useMemo(() => {
    return formatEther((totalAssetsData as number) ?? 0).toString();
  }, [totalAssetsData]);

  const totalAssetsUsdAmount = new BigNumber(totalAssets).isNaN()
    ? new BigNumber(0)
    : new BigNumber(totalAssets ?? 0).multipliedBy(dfiPrice);
  return {
    mDfiToDfiConversion,
    isDepositPaused,
    minDepositAmount,
    totalAssets,
    totalAssetsUsdAmount,
  };
}
