"use client";

import { useBalance, useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { ConnectKitButton } from "connectkit";
import { InputCard } from "@/app/app/components/InputCard";
import { CTAButton } from "@/components/button/CTAButton";
import Panel from "@/app/app/stake/components/Panel";
import AddressInput from "@/app/app/components/AddressInput";
import clsx from "clsx";
import BigNumber from "bignumber.js";
import { useContractContext } from "@/context/ContractContext";

export default function Stake() {
  const { Erc20Tokens } = useContractContext();

  const { address, isConnected, status, chainId } = useAccount();

  // check if chainId is mainnet or sepolia
  const isOnEthNetwork = chainId === 1 || chainId === 11155111;

  const { data: walletBalance } = useBalance({
    address,
    chainId,
    ...(isOnEthNetwork && {
      token: Erc20Tokens["DFI"].address,
    }),
  });

  const [stakeAmount, setStakeAmount] = useState<string>("");
  const [receivingWalletAddress, setReceivingWalletAddress] =
    useState<string>("");
  const [walletBalanceAmount, setWalletBalanceAmount] = useState<string>("NA");

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

  useEffect(() => {
    setWalletBalanceAmount(walletBalance?.formatted ?? "NA"); // set wallet balance
  }, [address, status, walletBalance]);

  return (
    <Panel>
      <div className="w-full gap-y-5">
        <h3 className="text-2xl font-semibold">Stake DFI</h3>
        <div className="flex flex-col w-full justify-between gap-y-5">
          <div className="mt-10">
            <div className="mb-5">
              <div className="flex justify-between gap-y-2 mb-2">
                <span className="text-xs md:text-sm py-1">
                  How much do you want to stake?
                </span>
                <WalletDetails
                  walletBalanceAmount={walletBalanceAmount}
                  isWalletConnected={isConnected}
                  style="md:block hidden"
                />
              </div>
              <div className="pb-2 md:pb-0">
                <InputCard
                  maxAmount={stakeAmount}
                  setAmount={setStakeAmount}
                  usdAmount={(new BigNumber(stakeAmount).isNaN()
                    ? new BigNumber(0)
                    : new BigNumber(stakeAmount)
                  ).toFixed(2)} // TODO use USDT price to calculate DFI amount
                />
              </div>
              <WalletDetails
                walletBalanceAmount={walletBalanceAmount}
                isWalletConnected={isConnected}
                style="block md:hidden"
              />
            </div>
            <div className="grid gap-y-2">
              <span className="text-xs md:text-sm py-1">Receiving address</span>
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
  walletBalanceAmount,
}: {
  isWalletConnected: boolean;
  style?: string;
  walletBalanceAmount?: string;
}) {
  return (
    <div
      data-testid="wallet-connection"
      className={clsx("flex items-center", style)}
    >
      {isWalletConnected ? (
        <p>
          <span className="opacity-40">Available: </span>
          <span className="font-semibold opacity-70">
            {walletBalanceAmount} DFI
          </span>
        </p>
      ) : (
        <span className="text-xs text-warning font-semibold">
          Connect wallet to get started
        </span>
      )}
    </div>
  );
}
