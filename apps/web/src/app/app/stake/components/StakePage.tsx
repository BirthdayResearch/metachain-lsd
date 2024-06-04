import Image from "next/image";
import WalletDetails from "@/app/app/components/WalletDetails";
import { InputCard } from "@/app/app/components/InputCard";
import BigNumber from "bignumber.js";
import ConnectedWalletSwitch from "@/app/app/stake/components/ConnectedWalletSwitch";
import AddressInput from "@/app/app/components/AddressInput";
import TransactionRows from "@/app/app/stake/components/TransactionRows";
import { CTAButton } from "@/components/button/CTAButton";
import { ConnectKitButton } from "connectkit";
import Panel from "@/app/app/stake/components/Panel";
import { useGetReadContractConfigs } from "@/hooks/useGetReadContractConfigs";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { formatEther } from "ethers";
import { useAccount, useBalance } from "wagmi";

export default function StakePage({
  stakeAmount,
  setStakeAmount,
  enableConnectedWallet,
  setEnableConnectedWallet,
  receivingWalletAddress,
  setReceivingWalletAddress,
  addressError,
  setAddressError,
  previewDeposit,
  isPending,
  submitStake,
  amountError,
  setAmountError,
}: {
  stakeAmount: string;
  setStakeAmount: (value: string) => void;
  enableConnectedWallet: boolean;
  setEnableConnectedWallet: Dispatch<SetStateAction<boolean>>;
  receivingWalletAddress?: string;
  setReceivingWalletAddress: (value: string) => void;
  addressError: string | null;
  setAddressError: (value: string | null) => void;
  previewDeposit: string;
  isPending: boolean;
  submitStake: () => void;
  amountError: string | null;
  setAmountError: Dispatch<SetStateAction<string | null>>;
}) {
  const { address, isConnected, status, chainId } = useAccount();

  const { minDepositAmount } = useGetReadContractConfigs();
  const { data: walletBalance } = useBalance({
    address,
    chainId,
  });

  const [walletBalanceAmount, setWalletBalanceAmount] = useState<string>("");

  const balance = formatEther(walletBalance?.value.toString() ?? "0");

  useEffect(() => {
    setWalletBalanceAmount(balance); // set wallet balance
  }, [address, status, balance]);

  const isDisabled =
    !stakeAmount ||
    !receivingWalletAddress ||
    !!(amountError || addressError) ||
    isPending;
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
                  suffix=" DFI"
                />
              </div>
              <div className="pb-2 md:pb-0">
                <InputCard
                  isConnected={isConnected}
                  maxAmount={new BigNumber(walletBalanceAmount)}
                  minAmount={new BigNumber(minDepositAmount)}
                  value={stakeAmount}
                  setAmount={setStakeAmount}
                  error={amountError}
                  setError={setAmountError}
                >
                  <Image
                    data-testid="dfi-icon"
                    src="/icons/dfi-icon.svg"
                    alt="DFI icon"
                    className="min-w-6"
                    priority
                    width={24}
                    height={24}
                  />
                </InputCard>
              </div>
              <WalletDetails
                walletBalanceAmount={walletBalanceAmount}
                isWalletConnected={isConnected}
                style="block md:hidden"
                suffix=" DFI"
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
          <div className="mb-10 md:mb-7 lg:mb-10">
            <TransactionRows previewAmount={previewDeposit} />
          </div>
        </div>
        {isConnected ? (
          <CTAButton
            isDisabled={isDisabled}
            isLoading={isPending}
            testId="instant-transfer-btn"
            label="Stake DFI"
            customStyle="w-full md:py-5"
            onClick={submitStake}
          />
        ) : (
          <ConnectKitButton.Custom>
            {({ show }) => (
              <CTAButton
                testId="instant-transfer-btn"
                label="Connect wallet"
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
