"use client";

import {
  useAccount,
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
  useConnectorClient,
} from "wagmi";
import { useEffect, useMemo, useState, useRef } from "react";
import { useContractContext } from "@/context/ContractContext";
import { Abi, parseEther } from "viem";
import { formatEther } from "ethers";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { toWei } from "@/lib/textHelper";
import StakeConfirmingPage from "@/app/app/stake/components/StakeConfirmingPage";
import StakeConfirmedPage from "@/app/app/stake/components/StakeConfirmedPage";
import StakePage from "@/app/app/stake/components/StakePage";
import { StakeStep } from "@/types";
import { watchAsset } from "viem/actions";
import PausedStakingPage from "@/app/app/stake/components/PausedStakingPage";

export default function Stake() {
  const mainContentRef = useRef(null);
  const [amountError, setAmountError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const { MarbleLsdProxy, mDFI } = useContractContext();

  const { data: connectorClient } = useConnectorClient();
  const [isAddTokenRequested, setIsAddTokenRequested] = useState(false);

  const addTokenToWallet = async () => {
    if (connectorClient) {
      try {
        setIsAddTokenRequested(true);
        const tokenAdded = await watchAsset(connectorClient, {
          type: "ERC20",
          options: {
            address: mDFI.address,
            decimals: mDFI.decimal,
            symbol: mDFI.symbol,
          },
        });
        if (tokenAdded) {
          toast("mDFI token added to wallet", {
            duration: 1000,
            className:
              "bg-green px-2 py-1 !text-xs !text-dark-00 !bg-green mt-10 !rounded-md",
            id: "tokenAdded",
          });
        }
      } finally {
        setIsAddTokenRequested(false);
      }
    }
  };

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
    `0x${string}` | string
  >(address ?? "");
  const [enableConnectedWallet, setEnableConnectedWallet] =
    useState(isConnected);

  // To prevent calling contract with invalid number (too large or too small)
  const validAmount = stakeAmount !== "" && !amountError;
  const stakeAmountString = validAmount ? stakeAmount : "0";

  const { data: previewDepositData } = useReadContract({
    address: MarbleLsdProxy.address,
    abi: MarbleLsdProxy.abi,
    functionName: "previewDeposit",
    args: [toWei(stakeAmountString)],
    query: {
      enabled: isConnected,
    },
  });

  const previewDeposit = useMemo(() => {
    return formatEther((previewDepositData as number) ?? 0).toString();
  }, [previewDepositData]);

  const { data: isDepositPausedData } = useReadContract({
    address: MarbleLsdProxy.address,
    abi: MarbleLsdProxy.abi,
    functionName: "isDepositPaused",
    query: {
      enabled: isConnected,
    },
  });
  const isDepositPaused = useMemo(() => {
    return (isDepositPausedData as boolean) ?? false;
  }, [isDepositPausedData]);

  const resetFields = () => {
    setStakeAmount("");
    setReceivingWalletAddress(address ?? "");
    setEnableConnectedWallet(isConnected);
    setAmountError(null);
    setAddressError(null);
  };

  function submitStake() {
    if (!amountError && !addressError) {
      writeContract(
        {
          abi: MarbleLsdProxy.abi as Abi,
          address: MarbleLsdProxy.address,
          functionName: "deposit",
          value: parseEther(stakeAmount),
          args: [receivingWalletAddress as string],
        },
        {
          onSuccess: (hash) => {
            if (hash) {
              setCurrentStepAndScroll(StakeStep.StakeConfirmingPage);
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
        setCurrentStepAndScroll(StakeStep.StakeConfirmationPage);
      }, 0);
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (receivingWalletAddress === address && !enableConnectedWallet) {
      setReceivingWalletAddress("");
    }
    if (enableConnectedWallet) {
      setReceivingWalletAddress(address ?? "");
    }
  }, [receivingWalletAddress, enableConnectedWallet]);

  const setCurrentStepAndScroll = (step: StakeStep) => {
    setCurrentStep(step);
    if (mainContentRef.current) {
      // TODO update this with NextJs scroll
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {!isDepositPaused ? (
        <div className="relative" ref={mainContentRef}>
          {/* First step: Stake page */}
          {currentStep === StakeStep.StakePage && (
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
              isPending={isPending}
              submitStake={submitStake}
              amountError={amountError}
              setAmountError={setAmountError}
            />
          )}

          {/* Second step: Confirming Stake page */}
          {currentStep === StakeStep.StakeConfirmingPage &&
            receivingWalletAddress &&
            hash && (
              <StakeConfirmingPage
                addTokenToWallet={addTokenToWallet}
                isAddTokenRequested={isAddTokenRequested}
                stakeAmount={stakeAmount}
                previewDeposit={previewDeposit}
                receivingWalletAddress={receivingWalletAddress}
                hash={hash}
                setCurrentStep={setCurrentStepAndScroll}
                resetFields={resetFields}
              />
            )}

          {/* Last step: Confirmed Stake page */}
          {currentStep === StakeStep.StakeConfirmationPage &&
            receivingWalletAddress &&
            hash && (
              <StakeConfirmedPage
                addTokenToWallet={addTokenToWallet}
                isAddTokenRequested={isAddTokenRequested}
                stakeAmount={stakeAmount}
                previewDeposit={previewDeposit}
                receivingWalletAddress={receivingWalletAddress}
                hash={hash}
                setCurrentStep={setCurrentStepAndScroll}
                resetFields={resetFields}
              />
            )}
        </div>
      ) : (
        <PausedStakingPage />
      )}
    </>
  );
}
