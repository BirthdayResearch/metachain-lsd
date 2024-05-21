"use client";

import {
  useAccount,
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useEffect, useMemo, useState } from "react";
import { useContractContext } from "@/context/ContractContext";
import { parseEther } from "viem";
import { formatEther } from "ethers";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { toWei } from "@/lib/textHelper";
import StakeConfirmingPage from "@/app/app/stake/components/StakeConfirmingPage";
import StakeConfirmedPage from "@/app/app/stake/components/StakeConfirmedPage";
import StakePage from "@/app/app/stake/components/StakePage";

export enum StakeStep {
  StakePage,
  StakeConfirmingPage,
  StakeConfirmationPage,
}

export default function Stake() {
  const [amountError, setAmountError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const { MarbleLsdProxy } = useContractContext();

  const { address, isConnected } = useAccount();
  const {
    data: hash,
    isPending,
    writeContract,
    status: writeStatus,
  } = useWriteContract();
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // To display /stake pages based on the current step
  const [currentStep, setCurrentStep] = useState<StakeStep>(
    StakeStep.StakePage,
  );

  const [stakeAmount, setStakeAmount] = useState<string>("");

  const [receivingWalletAddress, setReceivingWalletAddress] = useState<
    `0x${string}` | string | undefined
  >(address ?? "");
  const [enableConnectedWallet, setEnableConnectedWallet] =
    useState(isConnected);

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
    }

    // cleanup
    return () => toast.remove("deposit");
  }, [writeStatus]);

  // Display Confirmed stake page when transaction is confirmed on the block
  useEffect(() => {
    if (isConfirmed && currentStep !== StakeStep.StakeConfirmationPage) {
      // to schedule component change only after toast is removed
      setTimeout(() => {
        setCurrentStep(StakeStep.StakeConfirmationPage);
      }, 0);
    }
  }, [isConfirmed]);

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
      {/* First step: Stake poge */}
      {currentStep === StakeStep.StakePage ? (
        <StakePage
          stakeAmount={stakeAmount}
          setStakeAmount={setStakeAmount}
          enableConnectedWallet={enableConnectedWallet}
          setEnableConnectedWallet={setEnableConnectedWallet}
          receivingWalletAddress={receivingWalletAddress}
          setReceivingWalletAddress={setReceivingWalletAddress}
          addressError={addressError}
          setAddressError={setAddressError}
          previewDeposit={previewDeposit}
          isDisabled={isDisabled}
          isPending={isPending}
          submitStake={submitStake}
          amountError={amountError}
          setAmountError={setAmountError}
        />
      ) : null}

      {/* Second step: Confirming Stake page */}
      {currentStep === StakeStep.StakeConfirmingPage &&
      receivingWalletAddress &&
      hash ? (
        <StakeConfirmingPage
          stakeAmount={stakeAmount}
          previewDeposit={previewDeposit}
          receivingWalletAddress={receivingWalletAddress}
          hash={hash}
          setCurrentStep={setCurrentStep}
        />
      ) : null}

      {/* Last step: Confirmed Stake page */}
      {currentStep === StakeStep.StakeConfirmationPage &&
      receivingWalletAddress &&
      hash ? (
        <StakeConfirmedPage
          stakeAmount={stakeAmount}
          previewDeposit={previewDeposit}
          receivingWalletAddress={receivingWalletAddress}
          hash={hash}
          setCurrentStep={setCurrentStep}
        />
      ) : null}
    </div>
  );
}
