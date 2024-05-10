"use client";

import { useBalance, useAccount } from "wagmi";
import React, { useState } from "react";
import { ConnectKitButton } from "connectkit";
import { InputCard } from "@/app/app/components/InputCard";
import { CTAButton } from "@/components/button/CTAButton";
import Panel from "@/app/app/stake/components/Panel";
import AddressInput from "@/app/app/components/AddressInput";
import WalletDetails from "@/app/app/components/WalletDetails";
import BigNumber from "bignumber.js";
import TransactionRow from "@/app/app/components/TransactionRow";
import ConfirmPage from "@/app/app/components/ConfirmPage";
import { CTAButtonOutline } from "@/components/button/CTAButtonOutline";

enum StakeStep {
  StakePage,
  StakeConfirmingPage,
  StakeConfirmationPage,
}

export default function Stake() {
  const { address, isConnected } = useAccount();

  const { data: walletBalance } = useBalance({
    address,
  });

  const [currentStep, setCurrentStep] = useState<StakeStep>(
    StakeStep.StakePage,
  );

  const [stakeAmount, setStakeAmount] = useState<string>("");
  const maxStakeAmount = new BigNumber(walletBalance?.formatted ?? "0");
  const [receivingWalletAddress, setReceivingWalletAddress] =
    useState<string>("");

  // TODO
  async function submitStake() {
    // additional checks to ensure that the user's wallet balance is sufficient to cover the deposit amount
    // ensure that the entered amount meets the min. deposit req defined by the contract's minDeposit Variable
    try {
      setCurrentStep(StakeStep.StakeConfirmingPage);
    } catch (e) {
      setCurrentStep(StakeStep.StakePage);
    }
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
    <div className="relative">
      {/* Stake poge */}
      {currentStep === StakeStep.StakePage ? (
        <Panel>
          <div className="w-full gap-y-5">
            <h3 className="text-2xl font-semibold">Stake DFI</h3>
            <div className="flex flex-col w-full justify-between gap-y-5 mb-12 md:mb-10 lg:mb-16">
              <div className="mt-10">
                <div className="mb-5">
                  <div className="flex justify-between gap-y-2 mb-2">
                    <span className="text-xs md:text-sm py-1">
                      How much do you want to stake?
                    </span>
                    <WalletDetails
                      isWalletConnected={isConnected}
                      style="md:block hidden"
                    />
                  </div>
                  <div className="pb-2 md:pb-0">
                    <InputCard
                      maxAmount={maxStakeAmount}
                      value={stakeAmount}
                      setAmount={setStakeAmount}
                      usdAmount={(new BigNumber(stakeAmount).isNaN()
                        ? new BigNumber(0)
                        : new BigNumber(stakeAmount)
                      ).toFixed(2)} // TODO use USDT price to calculate DFI amount
                      onChange={(value) => setStakeAmount(value)}
                    />
                  </div>
                  <WalletDetails
                    isWalletConnected={isConnected}
                    style="block md:hidden"
                  />
                </div>
                <div className="grid gap-y-2">
                  <span className="text-xs md:text-sm py-1">
                    Receiving address
                  </span>
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
                  onClick={!isConnected ? show : () => submitStake()}
                />
              )}
            </ConnectKitButton.Custom>
          </div>
        </Panel>
      ) : null}

      {/* Confirming Stake page */}
      {currentStep === StakeStep.StakeConfirmingPage ? (
        <ConfirmPage
          title="Confirming your stake…"
          description="Waiting confirmation from the blockchain. It is safe to close this window – your transaction will reflect automatically in your wallet once completed."
          details={[
            {
              label: "You are staking",
              value: `${stakeAmount} DFI`,
            },
            {
              label: "You will receive",
              value: "2 mDFI",
            },
            {
              label: "Receiving Address",
              value: receivingWalletAddress,
            },
            {
              hasTxId: true,
              label: "Transaction ID",
              value:
                "0x78d75a997b2d1a074bb2b6a042ae262d675e3a5c8c2a1beeee94701d4bff3af7",
            },
          ]}
          buttons={
            <>
              <CTAButton
                label="Return to main page"
                testID="stake-confirming-return-main"
                customStyle="w-full"
                onClick={() => setCurrentStep(StakeStep.StakePage)}
              />
              <CTAButtonOutline
                label="Add mDFI to wallet"
                testID="stake-confirming-add-mdfi"
                customStyle="w-full"
              />
            </>
          }
        />
      ) : null}

      {/* Confirmed Stake page */}
      {currentStep === StakeStep.StakeConfirmationPage ? (
        // <StakeConfirmationPage />
        <div />
      ) : null}
    </div>
  );
}
