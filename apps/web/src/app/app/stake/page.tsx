"use client";

import { useBalance, useAccount } from "wagmi";
import React, { useState } from "react";
import { ConnectKitButton } from "connectkit";
import { InputCard } from "@/app/app/components/InputCard";
import { CTAButton } from "@/components/button/CTAButton";
import Panel from "@/app/app/stake/components/Panel";
import AddressInput from "@/app/app/components/AddressInput";
import BigNumber from "bignumber.js";
import WalletDetails from "./components/WalletDetails";
import TransactionRow from "@/app/app/components/TransactionRow";
import ConnectedWalletButton from "@/app/app/stake/components/ConnectedWalletButton";

export default function Stake() {
  const { address, isConnected } = useAccount();

  const { data: walletBalance } = useBalance({
    address,
  });

  const [stakeAmountDisplay, setStakeAmountDisplay] = useState<string>(
    parseFloat(walletBalance?.formatted ?? "0").toFixed(5),
  );
  const maxStakeAmount = new BigNumber(walletBalance?.formatted ?? "0");

  const [receivingWalletAddress, setReceivingWalletAddress] =
    useState<string>("");

  const [enableConnectedWallet, setEnableConnectedWallet] =
    useState(isConnected);

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
      <div className="w-full gap-y-5 mb-10">
        <h3 className="text-2xl font-semibold">Stake DFI</h3>
        <section className="flex flex-col w-full justify-between gap-y-5">
          {/* How much to stake and receiving address container */}
          <article className="mt-10">
            {/* How much to stake container */}
            <div className="mb-5">
              <div className="flex justify-between gap-y-2 mb-2">
                <span className="text-xs md:text-sm py-1">
                  How much do you want to stake?
                </span>
                <WalletDetails
                  isWalletConnected={isConnected}
                  style="md:block hidden"
                  walletAmount={stakeAmountDisplay}
                />
              </div>
              <div className="pb-2 md:pb-0">
                <InputCard
                  maxStakeAmount={maxStakeAmount}
                  stakeAmountDisplay={stakeAmountDisplay}
                  setAmount={setStakeAmountDisplay}
                  usdAmount={(new BigNumber(stakeAmountDisplay).isNaN()
                    ? new BigNumber(0)
                    : new BigNumber(stakeAmountDisplay)
                  ).toFixed(2)} // TODO use USDT price to calculate DFI amount
                  onChange={(value) => setStakeAmountDisplay(value)}
                />
              </div>
              <WalletDetails
                isWalletConnected={isConnected}
                style="block md:hidden"
                walletAmount={stakeAmountDisplay}
              />
            </div>
            <div className="grid gap-y-2">
              <article className="flex flex-row items-center justify-between">
                <span className="text-xs md:text-sm py-1">
                  Receiving address
                </span>
                <ConnectedWalletButton
                  customStyle="md:flex hidden"
                  enabled={enableConnectedWallet}
                  setEnabled={setEnableConnectedWallet}
                />
              </article>

              <AddressInput
                value={receivingWalletAddress}
                setValue={setReceivingWalletAddress}
                placeholder="Connect a wallet"
                isDisabled={!isConnected}
              />
              <ConnectedWalletButton
                customStyle="md:hidden flex"
                enabled={enableConnectedWallet}
                setEnabled={setEnableConnectedWallet}
              />
            </div>
          </article>
          <div>
            <TransactionRow label="You will receive" value="0.00 mDFI" />
            <TransactionRow label="Exchange rate" value="1 mDFI = 1 DFI" />
            <TransactionRow label="Max transaction cost" value="$0.00" />
          </div>
        </section>
        <ConnectKitButton.Custom>
          {({ show }) => (
            <CTAButton
              testID="instant-transfer-btn"
              label={getActionBtnLabel()}
              customStyle="w-full md:py-5 mt-10"
              onClick={!isConnected ? show : () => submitStake()}
            />
          )}
        </ConnectKitButton.Custom>
      </div>
    </Panel>
  );
}
