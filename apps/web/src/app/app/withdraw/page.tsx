"use client";

import Image from "next/image";
import { useAccount, useBalance } from "wagmi";
import React, { useEffect, useState } from "react";
import { ConnectKitButton } from "connectkit";
import { CTAButton } from "@/components/button/CTAButton";
import Panel from "@/app/app/stake/components/Panel";
import { InputCard } from "@/app/app/components/InputCard";
import WalletDetails from "@/app/app/components/WalletDetails";
import ComplimentarySection from "@/app/app/withdraw/components/ComplimentarySection";
import BigNumber from "bignumber.js";
import { formatEther } from "ethers";
import { useGetReadContractConfigs } from "@/hooks/useGetReadContractConfigs";

export default function Withdraw() {
  const { address, isConnected, status, chainId } = useAccount();

  const { data: walletBalance } = useBalance({
    address,
    chainId,
  });

  const { minDepositAmount } = useGetReadContractConfigs();

  const [amountError, setAmountError] = useState<string | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [walletBalanceAmount, setWalletBalanceAmount] = useState<string>("");

  const balance = formatEther(walletBalance?.value.toString() ?? "0");

  function getActionBtnLabel() {
    switch (true) {
      // case isSuccess:
      //   return "Return to Main Page";

      case isConnected:
        return "Withdraw mDFI";

      default:
        return "Connect wallet";
    }
  }

  useEffect(() => {
    setWalletBalanceAmount(balance); // set wallet balance
  }, [address, status, walletBalance]);

  return (
    <Panel>
      <div>
        <div className="w-full gap-y-5">
          <h3 className="text-2xl font-semibold">Withdraw DFI</h3>
          <div className="flex flex-col w-full justify-between gap-y-5">
            <div className="mt-10">
              <div className="mb-5">
                <div className="flex justify-between gap-y-2 mb-2">
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
                  Icon={
                    <Image
                      data-testid="mdfi-icon"
                      src="/icons/mdfi-icon.svg"
                      alt="MDFI icon"
                      className="min-w-6"
                      priority
                      width={24}
                      height={24}
                    />
                  }
                />
                <WalletDetails
                  walletBalanceAmount={walletBalanceAmount}
                  isWalletConnected={isConnected}
                  style="block md:hidden"
                />
              </div>
            </div>
            <div className="mb-12">
              <TransactionRow label="You will receive" value="0.00 mDFI" />
              <TransactionRow label="Exchange rate" value="1 mDFI = 1 DFI" />
              <TransactionRow label="Max transaction cost" value="$0.00" />
            </div>
          </div>
          <ConnectKitButton.Custom>
            {({ show }) => (
              <CTAButton
                testID="instant-transfer-btn"
                label={getActionBtnLabel()}
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

function TransactionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-row justify-between py-2 flex-1 text-wrap">
      <span className="text-xs md:text-sm">{label}</span>
      <span className="text-sm font-semibold text-right">{value}</span>
    </div>
  );
}
