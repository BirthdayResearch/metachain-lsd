import { useMemo } from "react";
import BigNumber from "bignumber.js";
import { useEstimateGas, useGasPrice } from "wagmi";
import { useContractContext } from "@/context/ContractContext";
import { formatEther, parseEther } from "ethers";
import { useDfiPrice } from "./useDfiPrice";

export function useGetTxnCost(data: `0x${string}`): {
  totalGas: BigNumber;
  txnCost: BigNumber;
} {
  const { MarbleLsdProxy } = useContractContext();
  const dfiPrice = useDfiPrice();

  const { data: estimateGas } = useEstimateGas({
    data,
    to: MarbleLsdProxy.address,
    value: parseEther("1"),
    query: {
      refetchIntervalInBackground: false,
    },
  });

  const { data: gasPrice } = useGasPrice();
  const totalGas = useMemo(
    () =>
      new BigNumber(estimateGas?.toString() ?? 0).multipliedBy(
        gasPrice?.toString() ?? 0,
      ),
    [estimateGas, gasPrice],
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
