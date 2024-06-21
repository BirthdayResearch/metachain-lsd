"use client";

import { useAccount, useReadContracts } from "wagmi";
import { useContractContext } from "@/context/ContractContext";
import Link from "next/link";
import stats from "./stats";
import StatsCard from "./components/StatusCard";

export default function Dashboard() {
  const { MarbleLsdProxy, ExplorerURL } = useContractContext();
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
        <div className="m-auto grid justify-items-stretch">
          <span className="font-bold text-xl justify-self-center">
            Dashboard
          </span>
          <Link
            className="justify-self-center text-blue-600"
            href={`${ExplorerURL}/address/${MarbleLsdProxy.address}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            MarbleFi Contract
          </Link>
        </div>
        {isConnected ? (
          <div className="grid md:grid-cols-2 gap-2 mt-4">
            {stats.map((each, index) => {
              const response = contractResponse
                ? contractResponse[index]
                : { result: "0" };
              return (
                <StatsCard
                  key={each.label}
                  label={each.label}
                  format={each.format as (value: string | string[]) => string}
                  decimal={each.decimal}
                  suffix={each.suffix}
                  writeMethod={each.writeMethod}
                  value={(response?.result as string) ?? "0"}
                />
              );
            })}
          </div>
        ) : (
          <div className="my-4">Connect Wallet to get status</div>
        )}
      </div>
    </div>
  );
}
