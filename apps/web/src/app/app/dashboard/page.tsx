"use client";

import { useAccount, useReadContracts } from "wagmi";
import NumericFormat from "@/components/NumericFormat";
import { useContractContext } from "@/context/ContractContext";
import { formatEther, parseEther } from "ethers";
import { FiCheckCircle, FiSlash } from "react-icons/fi";

const stats = [
  {
    functionName: "totalStakedAssets",
    parse: true,
    label: "Total Staked Assets",
  },
  {
    functionName: "totalShares",
    parse: true,
    label: "mDFI Total Supply",
  },
  {
    functionName: "totalAssets",
    parse: true,
    label: "Total Assets (Staked + Rewards)",
  },
  {
    functionName: "totalRewardAssets",
    parse: true,
    label: "Total Reward Assets",
  },
  {
    functionName: "getAvailableFundsToFlush",
    parse: true,
    label: "Available For Withdrawal",
  },
  {
    functionName: "convertToAssets",
    label: "mDFI-DFI Ratio",
    parse: true,
    args: [parseEther("1")],
  },
  {
    functionName: "minDeposit",
    parse: true,
    label: "Minimum Deposit",
  },
  {
    functionName: "minWithdrawal",
    parse: true,
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
    parse: true,
    decimal: 0,
    label: "Locked Assets",
  },
  {
    functionName: "mintingFees",
    decimal: 0,
    label: "Minting Fees",
  },
  {
    functionName: "performanceFees",
    decimal: 0,
    label: "Performance Fees",
  },
  {
    functionName: "redemptionFees",
    decimal: 0,
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
            console.log({ response, label: each.label });
            return (
              <StatsCard
                key={each.label}
                label={each.label}
                parse={each.parse}
                decimal={each.decimal}
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
  parse,
  decimal = 8,
}: {
  value: string | boolean;
  label: string;
  parse?: boolean;
  decimal?: number;
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
            decimalScale={decimal}
            value={
              parse && !isNaN(Number(value))
                ? formatEther(value).toString()
                : value
            }
            className="font-medium text-dark-300/80 text-wrap	break-all"
          />
        )}
        <span className="font-bold text-xs text-dark-300">{label}</span>
      </div>
    </div>
  );
}
