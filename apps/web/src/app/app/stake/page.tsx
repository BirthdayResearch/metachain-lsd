"use client";

import {
  useBalance,
  useAccount,
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useEffect, useMemo, useState } from "react";
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
import { getDecimalPlace, toWei } from "@/lib/textHelper";
import { useContractContext } from "@/context/ContractContext";
import { parseEther } from "viem";
import { useGetReadContractConfigs } from "@/hooks/useGetReadContractConfigs";
import { formatEther } from "ethers";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import ConfirmScreen from "@/app/app/components/ConfirmScreen";
import { CTAButtonOutline } from "@/components/button/CTAButtonOutline";

enum StakeStep {
  StakePage,
  StakeConfirmingPage,
  StakeConfirmationPage,
}

export default function Stake() {
  const [amountError, setAmountError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const { MarbleLsdProxy } = useContractContext();

  const { address, isConnected, status, chainId } = useAccount();
  const {
    data: hash,
    isPending,
    writeContract,
    status: writeStatus,
  } = useWriteContract();
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const { minDepositAmount } = useGetReadContractConfigs();

  const { data: walletBalance } = useBalance({
    address,
    chainId,
  });

  // To display /stake pages based on the current step
  const [currentStep, setCurrentStep] = useState<StakeStep>(
    StakeStep.StakePage,
  );

  const [stakeAmount, setStakeAmount] = useState<string>("");
  // to avoid multiple contract fetch
  const debounceStakeAmount = useDebounce(stakeAmount, 200);

  const [receivingWalletAddress, setReceivingWalletAddress] = useState<
    `0x${string}` | string | undefined
  >(address ?? "");
  const [walletBalanceAmount, setWalletBalanceAmount] = useState<string>("");
  const [enableConnectedWallet, setEnableConnectedWallet] =
    useState(isConnected);
  const balance = formatEther(walletBalance?.value.toString() ?? "0");

  const { data: previewDepositData } = useReadContract({
    address: MarbleLsdProxy.address,
    abi: MarbleLsdProxy.abi,
    functionName: "previewDeposit",
    args: [toWei(stakeAmount !== "" ? stakeAmount : "0")],
    query: {
      enabled: isConnected,
    },
  });

  const previewDeposit = useMemo(() => {
    return formatEther((previewDepositData as number) ?? 0).toString();
  }, [previewDepositData]);

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
          onSuccess: (hash) => {
            if (hash) {
              setCurrentStep(StakeStep.StakeConfirmingPage);
            }
          },
        },
      );
    }
  }

  useEffect(() => {
    if (writeStatus === "pending") {
      toast("Confirm transaction on your wallet.", {
        icon: <CgSpinner size={24} className="animate-spin text-green" />,
        duration: Infinity,
        className:
          "bg-green px-2 py-1 !text-sm !text-light-00 !bg-dark-00 mt-10 !px-6 !py-4 !rounded-md",
        id: "deposit",
      });
    } else {
      toast.remove("deposit");
    }
  }, [writeStatus]);

  // Display Confirmed stake page when transaction is confirmed on the block
  useEffect(() => {
    if (isConfirmed) {
      setCurrentStep(StakeStep.StakeConfirmationPage);
    }
  }, [isConfirmed]);

  useEffect(() => {
    setWalletBalanceAmount(balance); // set wallet balance
  }, [address, status, walletBalance]);

  useEffect(() => {
    if (receivingWalletAddress === address && !enableConnectedWallet) {
      setReceivingWalletAddress("");
    }
    if (enableConnectedWallet) {
      setReceivingWalletAddress(address);
    }
  }, [receivingWalletAddress, enableConnectedWallet]);

  const isDisabled =
    !stakeAmount ||
    !receivingWalletAddress ||
    !!(amountError || addressError) ||
    isPending;

  return (
    <div className="relative">
      {/* Stake poge */}
      {currentStep === StakeStep.StakePage ? (
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
                      maxAmount={new BigNumber(walletBalanceAmount)}
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
                isDisabled={isDisabled}
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
      ) : null}

      {/* Confirming Stake page */}
      {currentStep === StakeStep.StakeConfirmingPage &&
      receivingWalletAddress &&
      hash ? (
        <ConfirmScreen
          isLoading={true}
          title="Confirming your stake…"
          description="Waiting confirmation from the blockchain. It is safe to close this window – your transaction will reflect automatically in your wallet once completed."
          details={[
            {
              label: "You are staking",
              value: `${stakeAmount} DFI`,
            },
            {
              label: "You will receive",
              value: `${previewDeposit} mDFI`,
            },
            {
              label: "Receiving Address",
              value: receivingWalletAddress,
            },
            {
              hasTxId: true,
              label: "Transaction ID",
              value: hash,
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
      {currentStep === StakeStep.StakeConfirmationPage &&
      receivingWalletAddress &&
      hash ? (
        <ConfirmScreen
          hasCompleted={true}
          title="Stake confirmed"
          description="This may take a moment. It is safe to close this window – your transaction will reflect automatically in your wallet once completed."
          details={[
            {
              label: "Amount staked",
              value: `${stakeAmount} DFI`,
            },
            {
              label: "Amount to receive",
              value: `${previewDeposit} mDFI`,
            },
            {
              label: "Receiving Address",
              value: receivingWalletAddress,
            },
            {
              hasTxId: true,
              label: "Transaction ID",
              value: hash,
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
