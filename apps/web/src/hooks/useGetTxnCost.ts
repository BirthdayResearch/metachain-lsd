import { useMemo } from "react";
import BigNumber from "bignumber.js";
import { useEstimateGas, useEstimateFeesPerGas } from "wagmi";
import { useContractContext } from "@/context/ContractContext";
import { formatEther } from "ethers";
import { useDfiPrice } from "./useDfiPrice";

export function useGetTxnCost(
  data: `0x${string}`,
  value: bigint,
): {
  totalGas: BigNumber;
  txnCost: BigNumber;
} {
  const { MarbleLsdProxy } = useContractContext();
  const { data: estimatedGasData } = useEstimateFeesPerGas();
  const dfiPrice = useDfiPrice();

  const { data: estimateGas } = useEstimateGas({
    data,
    value,
    to: MarbleLsdProxy.address,
    query: {
      refetchIntervalInBackground: false,
    },
  });

  const totalGas = useMemo(
    () =>
      new BigNumber(estimateGas?.toString() ?? 0).multipliedBy(
        estimatedGasData?.maxFeePerGas?.toString() ?? 0,
      ),
    [estimateGas, estimatedGasData?.maxFeePerGas],
  );

  const txnCost = useMemo(
    () => dfiPrice.multipliedBy(formatEther(totalGas.toString()).toString()),
    [totalGas, dfiPrice],
  );

  return {
    totalGas,
    txnCost,
  };
}
