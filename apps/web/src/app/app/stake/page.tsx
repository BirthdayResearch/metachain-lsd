"use client";

import { useBalance, useAccount } from "wagmi";
import { useState } from "react";
import { ConnectKitButton } from "connectkit";
import { InputCard } from "@/app/app/components/InputCard";
import { CTAButton } from "@/components/button/CTAButton";
import Panel from "@/app/app/stake/components/Panel";
import AddressInput from "@/app/app/components/AddressInput";
import clsx from "clsx";

export default function Stake() {
  const { address, isConnected } = useAccount();

  const { data: walletBalance } = useBalance({
    address,
  });

  const [stakeAmount, setStakeAmount] = useState<string>("");
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [receivingWalletAddress, setReceivingWalletAddress] =
    useState<string>("");

  // TODO
  async function submitStake() {
    // additional checks to ensure that the user's wallet balance is sufficient to cover the deposit amount
    // ensure that the entered amount meets the min. deposit req defined by the contract's minDeposit Variable
  }

  function getActionBtnLabel() {
    switch (true) {
      // case isSuccess:
      //   return "Return to Main Page";

      case isConnected:
        return "Stake DFI";

      default:
        return "Connect wallet";
    }
  }

  return (
    <Panel>
      <div className="w-full grid gap-y-5">
        <h3 className="text-2xl font-semibold">Stake DFI</h3>
        <div className="flex flex-col w-full justify-between gap-y-5">
          <div className="grid gap-y-5">
            <div className="grid gap-y-2">
              <div className="flex justify-between gap-y-2">
                <span className="text-xs md:text-sm">
                  How much do you want to stake?
                </span>
                <WalletDetails
                  isWalletConnected={isWalletConnected}
                  style="md:block hidden"
                />
              </div>
              <InputCard
                amount={stakeAmount}
                setAmount={setStakeAmount}
                value="999"
              />
              <WalletDetails
                isWalletConnected={isWalletConnected}
                style="block md:hidden"
              />
            </div>
            <div>
              <span className="text-xs md:text-sm">Receiving address</span>
              <AddressInput
                value={receivingWalletAddress}
                setValue={setReceivingWalletAddress}
                placeholder="Connect a wallet"
                isDisabled={!isConnected}
              />
            </div>
          </div>
          <div>
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
              // isLoading={hasPendingTxn || isVerifyingTransaction}
              // disabled={
              //   (isConnected && !isFormValid) ||
              //   hasPendingTxn ||
              //   !isBalanceSufficient
              // }
              // isDisabled={!writeDepositTxn}
              onClick={!isConnected ? show : () => submitStake()}
            />
          )}
        </ConnectKitButton.Custom>
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
