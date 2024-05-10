"use client";

import Image from "next/image";
import { useBalance, useAccount } from "wagmi";
import { useEffect, useRef, useState } from "react";
import { ConnectKitButton } from "connectkit";
import { InputCard } from "@/app/app/components/InputCard";
import { CTAButton } from "@/components/button/CTAButton";
import Panel from "@/app/app/stake/components/Panel";
import AddressInput from "@/app/app/components/AddressInput";
import clsx from "clsx";
import BigNumber from "bignumber.js";
import ConnectedWalletSwitch from "@/app/app/stake/components/ConnectedWalletSwitch";

export default function Stake() {
  const inputRef = useRef<HTMLInputElement>(null);

  const { address, isConnected, status, chainId } = useAccount();

  const { data: walletBalance } = useBalance({
    address,
    chainId,
  });

  const [stakeAmount, setStakeAmount] = useState<string>("");
  const [receivingWalletAddress, setReceivingWalletAddress] = useState<
    `0x${string}` | string | undefined
  >(address);
  const [walletBalanceAmount, setWalletBalanceAmount] = useState<string>("NA");
  const [enableConnectedWallet, setEnableConnectedWallet] =
    useState(isConnected);
  const maxStakeAmount = new BigNumber(walletBalance?.formatted ?? "0");

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

  useEffect(() => {
    if (receivingWalletAddress === address && !enableConnectedWallet) {
      setReceivingWalletAddress("");
    }
    if (enableConnectedWallet) {
      setReceivingWalletAddress(address);
    }
    const handleClick = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        receivingWalletAddress === "" &&
        !enableConnectedWallet
      ) {
        setEnableConnectedWallet(true);
        setReceivingWalletAddress(address);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [receivingWalletAddress, enableConnectedWallet]);

  return (
    <Panel>
      <div className="w-full gap-y-5">
        <h3 className="text-2xl leading-7 font-semibold">Stake DFI</h3>
        <div className="flex flex-col w-full justify-between gap-y-5">
          <div className="mt-10">
            <div className="mb-5">
              <div className="flex justify-between gap-y-2 mb-2 items-center">
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
                  maxAmount={maxStakeAmount}
                  value={stakeAmount}
                  setAmount={setStakeAmount}
                  usdAmount={(new BigNumber(stakeAmount).isNaN()
                    ? new BigNumber(0)
                    : new BigNumber(stakeAmount)
                  ).toFixed(2)} // TODO use USDT price to calculate DFI amount
                  onChange={(value) => setStakeAmount(value)}
                  Icon={
                    <Image
                      data-testid="dfi-icon"
                      src="/icons/dfi-icon.svg"
                      alt="DFI icon"
                      className="min-w-6"
                      priority
                      width={24}
                      height={24}
                    />
                  }
                />
              </div>
              <WalletDetails
                walletBalanceAmount={walletBalanceAmount}
                isWalletConnected={isConnected}
                style="block md:hidden"
              />
            </div>
            <div className="grid gap-y-2">
              <div className="flex flex-row items-center justify-between">
                <span className="text-xs md:text-sm py-1">
                  Receiving address
                </span>
                <ConnectedWalletSwitch
                  customStyle="md:flex hidden"
                  enableConnectedWallet={enableConnectedWallet}
                  setEnableConnectedWallet={setEnableConnectedWallet}
                />
              </div>
              <div ref={inputRef}>
                <AddressInput
                  value={
                    enableConnectedWallet ? address : receivingWalletAddress
                  }
                  setValue={setReceivingWalletAddress}
                  receivingWalletAddress={address}
                  setEnableConnectedWallet={setEnableConnectedWallet}
                  placeholder="Connect a wallet"
                  isDisabled={!isConnected}
                />
              </div>

              <ConnectedWalletSwitch
                customStyle="flex md:hidden"
                enableConnectedWallet={enableConnectedWallet}
                setEnableConnectedWallet={setEnableConnectedWallet}
              />
            </div>
          </div>
          <div className="mb-12 md:mb-9 lg:mb-12">
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
        <p className="text-xs text-light-1000/50">
          <span>Available: </span>
          <span className="font-semibold">{walletBalanceAmount} DFI</span>
        </p>
      ) : (
        <span className="text-xs text-warning font-semibold">
          Connect wallet to get started
        </span>
      )}
    </div>
  );
}
