import { useMemo } from "react";
import BigNumber from "bignumber.js";
import { useEstimateGas, useGasPrice } from "wagmi";
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
  const dfiPrice = useDfiPrice();
  const { data: gasPrice } = useGasPrice();

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
        gasPrice?.toString() ?? 0,
      ),
    [estimateGas, gasPrice],
  );

  const txnCost = useMemo(
    () => dfiPrice.multipliedBy(formatEther(totalGas.toFixed()).toString()),
    [totalGas, dfiPrice],
  );

  return {
    totalGas,
    txnCost,
  };
}
