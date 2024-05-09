"use client";

import { useAccount } from "wagmi";
import React, { useState } from "react";
import { ConnectKitButton } from "connectkit";
import { CTAButton } from "@/components/button/CTAButton";
import Panel from "@/app/app/stake/components/Panel";
import AddressInput from "@/app/app/components/AddressInput";
import clsx from "clsx";
import ComplimentarySection from "@/app/app/withdraw/components/ComplimentarySection";

export default function Withdraw() {
  const { isConnected } = useAccount();

  const [receivingWalletAddress, setReceivingWalletAddress] =
    useState<string>("");

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
                    isWalletConnected={isConnected}
                    style="md:block hidden"
                  />
                </div>
              </div>
              <div className="grid gap-y-2">
                <AddressInput
                  value={receivingWalletAddress}
                  setValue={setReceivingWalletAddress}
                  placeholder="Connect a wallet"
                  isDisabled={!isConnected}
                />
                <WalletDetails
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

function WalletDetails({
  isWalletConnected,
  style,
}: {
  isWalletConnected: boolean;
  style?: string;
}) {
  return (
    <div
      data-testid="wallet-connection"
      className={clsx("flex items-center", style)}
    >
      {isWalletConnected ? (
        <p>
          <span className="opacity-40">Available: </span>
          <span className="font-semibold opacity-70">walletAmount</span>
        </p>
      ) : (
        <span className="text-xs text-warning font-semibold">
          Connect wallet to get started
        </span>
      )}
    </div>
  );
}
