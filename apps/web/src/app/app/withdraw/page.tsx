"use client";

import Image from "next/image";
import { useAccount, useBalance, useReadContract } from "wagmi";
import React, { useEffect, useMemo, useState } from "react";
import { ConnectKitButton } from "connectkit";
import { CTAButton } from "@/components/button/CTAButton";
import Panel from "@/app/app/stake/components/Panel";
import { InputCard } from "@/app/app/components/InputCard";
import WalletDetails from "@/app/app/components/WalletDetails";
import ComplimentarySection from "@/app/app/withdraw/components/ComplimentarySection";
import BigNumber from "bignumber.js";
import { formatEther } from "ethers";
import { useGetReadContractConfigs } from "@/hooks/useGetReadContractConfigs";
import { NumericTransactionRow } from "@/app/app/components/NumericTransactionRow";
import { getDecimalPlace, toWei } from "@/lib/textHelper";
import TransactionRows from "@/app/app/stake/components/TransactionRows";
import { useContractContext } from "@/context/ContractContext";

export default function Withdraw() {
  const { address, isConnected, status, chainId } = useAccount();
  const { MarbleLsdProxy } = useContractContext();

  const { data: walletBalance } = useBalance({
    address,
    chainId,
  });

  const { minDepositAmount } = useGetReadContractConfigs();

  const [amountError, setAmountError] = useState<string | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [walletBalanceAmount, setWalletBalanceAmount] = useState<string>("");

  const { data: previewDepositData } = useReadContract({
    address: MarbleLsdProxy.address,
    abi: MarbleLsdProxy.abi,
    functionName: "previewDeposit",
    args: [toWei(withdrawAmount !== "" ? withdrawAmount : "0")],
    query: {
      enabled: isConnected,
    },
  });

  const previewDeposit = useMemo(() => {
    return formatEther((previewDepositData as number) ?? 0).toString();
  }, [previewDepositData]);

  const balance = formatEther(walletBalance?.value.toString() ?? "0");

  useEffect(() => {
    setWalletBalanceAmount(balance); // set wallet balance
  }, [address, status, walletBalance]);

  return (
    <Panel>
      <div>
        <div className="w-full gap-y-5">
          <h3 className="text-2xl font-semibold">Withdraw DFI</h3>
          <div className="flex flex-col w-full justify-between gap-y-5">
            <div className="mt-10 md:mt-7 lg:mt-10">
              <div className="mb-5">
                <div className="flex items-center justify-between gap-y-2 mb-2">
                  <span className="text-xs md:text-sm py-1">
                    How much do you want to withdraw?
                  </span>
                  <WalletDetails
                    walletBalanceAmount={walletBalanceAmount}
                    isWalletConnected={isConnected}
                    style="md:block hidden"
                  />
                </div>
              </div>
              <div className="grid gap-y-2">
                <InputCard
                  isConnected={isConnected}
                  maxAmount={new BigNumber(walletBalanceAmount)}
                  minAmount={new BigNumber(minDepositAmount)}
                  error={amountError}
                  setError={setAmountError}
                  value={withdrawAmount}
                  setAmount={setWithdrawAmount}
                >
                  <Image
                    data-testid="mdfi-icon"
                    src="/icons/mdfi-icon.svg"
                    alt="MDFI icon"
                    className="min-w-6"
                    priority
                    width={24}
                    height={24}
                  />
                </InputCard>
                <WalletDetails
                  walletBalanceAmount={walletBalanceAmount}
                  isWalletConnected={isConnected}
                  style="block md:hidden"
                />
              </div>
            </div>
            <div className="mb-10 md:mb-7 lg:mb-10">
              <TransactionRows previewDeposit={previewDeposit} />
              <span className="block my-2 w-full border-dark-00/10 border-t-[0.5px]" />
              <div className="flex flex-col gap-y-1">
                <NumericTransactionRow
                  label="Total liquidity"
                  tooltipText="Total amount available for withdrawal."
                  value={{
                    value: 133939,
                    suffix: " DFI",
                    decimalScale: 0,
                  }}
                  secondaryValue={{
                    value: 3.23,
                    decimalScale: getDecimalPlace(3.23),
                    prefix: "$",
                  }}
                />
                <NumericTransactionRow
                  label="Annual rewards"
                  value={{
                    value: 3.34,
                    suffix: "%",
                    decimalScale: getDecimalPlace(3.34),
                  }}
                />
              </div>
            </div>
          </div>
          <ConnectKitButton.Custom>
            {({ show }) => (
              <CTAButton
                testId="instant-transfer-btn"
                label={isConnected ? "Withdraw mDFI" : "Connect wallet"}
                customStyle="w-full md:py-5"
              />
            )}
          </ConnectKitButton.Custom>
        </div>
        <ComplimentarySection />
      </div>
    </Panel>
  );
}
