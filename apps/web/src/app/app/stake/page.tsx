"use client";

import { useBalance, useAccount, useWriteContract } from "wagmi";
import { useEffect, useState } from "react";
import { ConnectKitButton } from "connectkit";
import { InputCard } from "@/app/app/components/InputCard";
import { CTAButton } from "@/components/button/CTAButton";
import Panel from "@/app/app/stake/components/Panel";
import AddressInput from "@/app/app/components/AddressInput";
import clsx from "clsx";
import BigNumber from "bignumber.js";
import ConnectedWalletSwitch from "@/app/app/stake/components/ConnectedWalletSwitch";
import TransactionRows from "./components/TransactionRows";
import useDebounce from "@/hooks/useDebounce";
import NumericFormat from "@/components/NumericFormat";
import { getDecimalPlace } from "@/lib/textHelper";
import { useContractContext } from "@/context/ContractContext";
import { parseEther } from "viem";
import { useGetReadContractConfigs } from "@/hooks/useGetReadContractConfigs";

export default function Stake() {
  const [amountError, setAmountError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const { MarbleLsdProxy } = useContractContext();

  const { address, isConnected, status, chainId } = useAccount();
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { minDepositAmount } = useGetReadContractConfigs();

  const { data: walletBalance } = useBalance({
    address,
    chainId,
  });

  const [stakeAmount, setStakeAmount] = useState<string>("");
  // to avoid multiple contract fetch
  const debounceStakeAmount = useDebounce(stakeAmount, 200);

  const [receivingWalletAddress, setReceivingWalletAddress] = useState<
    `0x${string}` | string | undefined
  >(address ?? "");
  const [walletBalanceAmount, setWalletBalanceAmount] = useState<string>("");
  const [enableConnectedWallet, setEnableConnectedWallet] =
    useState(isConnected);
  const maxStakeAmount = new BigNumber(walletBalance?.formatted ?? "0");

  function submitStake() {
    if (!amountError && !addressError) {
      writeContract(
        {
          abi: MarbleLsdProxy.abi,
          address: MarbleLsdProxy.address,
          functionName: "deposit",
          value: parseEther(stakeAmount),
          args: [receivingWalletAddress as string],
        },
        {
          onSuccess: () => {
            console.log("Txn hash:", hash);
            // add redirect logic here
          },
        },
      );
    }
  }

  useEffect(() => {
    setWalletBalanceAmount(walletBalance?.formatted ?? ""); // set wallet balance
  }, [address, status, walletBalance]);

  useEffect(() => {
    if (receivingWalletAddress === address && !enableConnectedWallet) {
      setReceivingWalletAddress("");
    }
    if (enableConnectedWallet) {
      setReceivingWalletAddress(address);
    }
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
                  isConnected={isConnected}
                  maxAmount={maxStakeAmount}
                  minAmount={new BigNumber(minDepositAmount)}
                  value={stakeAmount}
                  setAmount={setStakeAmount}
                  error={amountError}
                  setError={setAmountError}
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
                {isConnected && (
                  <ConnectedWalletSwitch
                    customStyle="md:flex hidden"
                    enableConnectedWallet={enableConnectedWallet}
                    setEnableConnectedWallet={setEnableConnectedWallet}
                  />
                )}
              </div>
              <AddressInput
                value={
                  isConnected
                    ? enableConnectedWallet
                      ? address
                      : receivingWalletAddress
                    : ""
                }
                setValue={setReceivingWalletAddress}
                receivingWalletAddress={address}
                setEnableConnectedWallet={setEnableConnectedWallet}
                placeholder={
                  isConnected
                    ? "Enter wallet address to receive mDFI"
                    : "Connect a wallet"
                }
                isDisabled={!isConnected}
                error={addressError}
                setError={setAddressError}
              />

              {isConnected && (
                <ConnectedWalletSwitch
                  customStyle="flex md:hidden"
                  enableConnectedWallet={enableConnectedWallet}
                  setEnableConnectedWallet={setEnableConnectedWallet}
                />
              )}
            </div>
          </div>
          <TransactionRows
            stakeAmount={debounceStakeAmount}
            isConnected={isConnected}
          />
        </div>
        {isConnected ? (
          <CTAButton
            isDisabled={!!(amountError || addressError) || isPending}
            isLoading={isPending}
            testID="instant-transfer-btn"
            label={"Stake DFI"}
            customStyle="w-full md:py-5"
            onClick={submitStake}
          />
        ) : (
          <ConnectKitButton.Custom>
            {({ show }) => (
              <CTAButton
                testID="instant-transfer-btn"
                label={"Connect wallet"}
                customStyle="w-full md:py-5"
                onClick={show}
              />
            )}
          </ConnectKitButton.Custom>
        )}
      </div>
    </Panel>
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
  const decimalScale = getDecimalPlace(walletBalanceAmount ?? 0);
  return (
    <div
      data-testid="wallet-connection"
      className={clsx("flex items-center", style)}
    >
      {isWalletConnected ? (
        <p className="text-xs text-light-1000/50">
          <span>Available: </span>
          <NumericFormat
            className="font-semibold"
            suffix=" DFI"
            value={new BigNumber(walletBalanceAmount ?? 0).toFormat(
              decimalScale,
              BigNumber.ROUND_FLOOR,
            )}
            decimalScale={decimalScale}
          />
        </p>
      ) : (
        <span className="text-xs text-warning font-semibold">
          Connect wallet to get started
        </span>
      )}
    </div>
  );
}
