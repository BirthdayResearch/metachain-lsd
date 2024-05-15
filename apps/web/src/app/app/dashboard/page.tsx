"use client";

import { useAccount, useReadContracts } from "wagmi";
import NumericFormat from "@/components/NumericFormat";
import { useContractContext } from "@/context/ContractContext";
import { formatEther, parseEther } from "ethers";
import { FiCheckCircle, FiSlash } from "react-icons/fi";
import BigNumber from "bignumber.js";

const stats = [
  {
    functionName: "totalStakedAssets",
    format: (value: string) => formatEther(value).toString(),
    label: "Total Staked Assets",
  },
  {
    functionName: "totalShares",
    format: (value: string) => formatEther(value).toString(),
    label: "mDFI Total Supply",
  },
  {
    functionName: "totalAssets",
    format: (value: string) => formatEther(value).toString(),
    label: "Total Assets (Staked + Rewards)",
  },
  {
    functionName: "totalRewardAssets",
    format: (value: string) => formatEther(value).toString(),
    label: "Total Reward Assets",
  },
  {
    functionName: "getAvailableFundsToFlush",
    format: (value: string) => formatEther(value).toString(),
    label: "Available For Withdrawal",
  },
  {
    functionName: "convertToAssets",
    label: "mDFI-DFI Ratio",
    format: (value: string) => formatEther(value).toString(),
    args: [parseEther("1")],
  },
  {
    functionName: "minDeposit",
    format: (value: string) => formatEther(value).toString(),
    label: "Minimum Deposit",
  },
  {
    functionName: "minWithdrawal",
    format: (value: string) => formatEther(value).toString(),
    label: "Minimum Withdrawal",
  },
  {
    functionName: "lastFinalizedRequestId",
    decimal: 0,
    label: "Last Finalized Req No",
  },
  {
    functionName: "lastRequestId",
    decimal: 0,
    label: "Withdrawal Req No",
  },
  {
    functionName: "lockedAssets",
    format: (value: string) => formatEther(value).toString(),
    decimal: 0,
    label: "Locked Assets",
  },
  {
    functionName: "mintingFees",
    decimal: 2,
    suffix: "%",
    format: (value: string) => new BigNumber(value).dividedBy(100).toString(),
    label: "Minting Fees",
  },
  {
    functionName: "performanceFees",
    decimal: 2,
    suffix: "%",
    format: (value: string) => new BigNumber(value).dividedBy(100).toString(),
    label: "Performance Fees",
  },
  {
    functionName: "redemptionFees",
    decimal: 2,
    suffix: "%",
    format: (value: string) => new BigNumber(value).dividedBy(100).toString(),
    label: "Redemption Fees",
  },
  {
    functionName: "isDepositPaused",
    label: "Deposit Paused",
  },
  {
    functionName: "isWithdrawalPaused",
    label: "Withdrawal Paused",
  },
];

export default function Dashboard() {
  const { MarbleLsdProxy } = useContractContext();

  const { isConnected } = useAccount();

  const { data: contractResponse } = useReadContracts({
    contracts: stats.map(({ functionName, args }) => {
      return {
        address: MarbleLsdProxy.address,
        abi: MarbleLsdProxy.abi,
        functionName,
        args,
      };
    }),
    query: {
      enabled: isConnected,
      refetchInterval: 10000,
    },
  });
  return (
    <div className="panel-ui rounded-[30px] flex flex-col p-5 mx-auto w-full md:max-w-4xl">
      <div>
        <div className="font-bold text-xl m-auto grid justify-items-stretch">
          <span className="justify-self-center">Dashboard</span>
        </div>
        <div className="grid md:grid-cols-2 gap-2 mt-4">
          {stats.map((each, index) => {
            const response = contractResponse
              ? contractResponse[index] ?? {}
              : {};
            return (
              <StatsCard
                key={each.label}
                label={each.label}
                format={each.format}
                decimal={each.decimal}
                suffix={each.suffix}
                value={response?.result ?? "0"}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatsCard({
  value,
  label,
  format,
  decimal = 8,
  suffix,
}: {
  value: string | boolean;
  label: string;
  format?: (value: string) => string;
  decimal?: number;
  suffix?: string;
}) {
  return (
    <div className="panel-ui w-full border border-dark-700/40 rounded-md flex flex-col p-4 mx-auto !backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        {typeof value === "boolean" ? (
          <span className="font-medium text-dark-300/80 text-wrap	break-all">
            {value ? (
              <FiCheckCircle size={24} className="text-green" />
            ) : (
              <FiSlash size={24} className="text-red" />
            )}
          </span>
        ) : (
          <NumericFormat
            suffix={suffix}
            decimalScale={decimal}
            value={format ? format(value) : value}
            className="font-medium text-dark-300/80 text-wrap	break-all"
          />
        )}
        <span className="font-bold text-xs text-dark-300">{label}</span>
      </div>
    </div>
  );
}
