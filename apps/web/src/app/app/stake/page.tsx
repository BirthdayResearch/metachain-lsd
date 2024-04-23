"use client";

import { formatEther } from "viem";

import {
  useContractRead,
  useContractWrite,
  useBalance,
  useAccount,
} from "wagmi";
import { useEffect, useMemo, useState } from "react";
import { parseEther } from "viem";
import { ConnectKitButton } from "connectkit";
import BigNumber from "bignumber.js";
import { InputCard } from "@/app/ui/components/InputCard";
import { CTAButton } from "@/components/button/CTAButton";
import { useRouter } from "next/navigation";
import { useDfiPrice } from "@/hooks/useDfiPrice";
import { useContractContext } from "@/context/ContractContext";
import { useNetworkContext } from "@waveshq/walletkit-ui";
import DialogueBox from "@/app/app/stake/components/DialogueBox";
import Statistics from "@/app/app/stake/components/Statistics";
import Image from "next/image";
import ToggleSwitch from "@/components/ToggleSwitch";

enum AmountButton {
  TwentyFive = "25%",
  Half = "50%",
  SeventyFive = "75%",
  Max = "Max",
}

export function PercentageButton({
  amount,
  percentage,
  onClick,
  disabled,
}: {
  percentage: AmountButton;
  amount: BigNumber;
  onClick: (amount: string) => void;
  disabled: boolean;
}) {
  const decimalPlace = 5;
  let value = amount.toFixed(decimalPlace, BigNumber.ROUND_FLOOR);

  switch (percentage) {
    case AmountButton.TwentyFive:
      value = amount
        .multipliedBy(0.25)
        .toFixed(decimalPlace, BigNumber.ROUND_FLOOR);
      break;
    case AmountButton.Half:
      value = amount
        .multipliedBy(0.5)
        .toFixed(decimalPlace, BigNumber.ROUND_FLOOR);
      break;
    case AmountButton.SeventyFive:
      value = amount
        .multipliedBy(0.75)
        .toFixed(decimalPlace, BigNumber.ROUND_FLOOR);
      break;
    case AmountButton.Max:
    default:
      value = amount.toFixed(decimalPlace, BigNumber.ROUND_FLOOR);
      break;
  }

  return (
    <button
      data-testid={`percentage-button-${percentage}`}
      className="py-2 gap-x-1 grid w-[49px] hover:accent-2 rounded-[15px]"
      onClick={(): void => {
        onClick(value);
      }}
      disabled={disabled}
    >
      <span className="font-medium text-xs">{percentage}</span>
    </button>
  );
}
export enum Network {
  Ethereum = "Ethereum",
  DeFiChain = "DeFiChain",
}

export default function Stake() {
  const { push } = useRouter();
  const { network } = useNetworkContext();

  const { Erc20Tokens } = useContractContext();

  const { address, isConnected, status, chainId } = useAccount();

  // check if chainId is mainnet or sepolia
  const isOnEthNetwork = chainId === 1 || chainId === 11155111;

  const {
    data: walletBalance,
    refetch: refetchWalletBalance,
    isFetching: isWalletBalanceFetching,
  } = useBalance({
    address,
    // sepolia DFI address
    // token: "0x1f84B07483AC2D5f212a7bF14184310baE087448",
    chainId,
    ...(isOnEthNetwork && {
      token: Erc20Tokens["DFI"].address,
    }),
  });

  // const { MarbleLsdV1 } = useContractContext();
  // const dfiPrice = useDfiPrice();
  //
  const [stakeAmount, setStakeAmount] = useState<string>("");
  const [walletBalanceAmount, setWalletBalanceAmount] = useState<string>("NA");
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [isUsingConnectedWallet, setIsUsingConnectedWallet] =
    useState<boolean>(true);
  //
  // // To display stake amount in USD
  // const stakedValue = useMemo(() => {
  //   const calculatedStake = new BigNumber(stakeAmount).multipliedBy(dfiPrice);
  //   return calculatedStake.isNaN() ? "0.00" : calculatedStake.toString();
  // }, [stakeAmount, dfiPrice]);

  // const {
  //   data: depositFundData,
  //   error: depositFuncTxnError,
  //   write: writeDepositTxn,
  //   isLoading: isDepositInProgress,
  // } = useContractWrite({
  //   abi: MarbleLsdV1.abi,
  //   address: MarbleLsdV1.address,
  //   functionName: "deposit",
  //   args: ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"], // receiver address of the staked tokens
  //   value: parseEther(stakeAmount),
  // });

  // const { data: previewDepositData, error: previewDepositTxnError } =
  //   useContractRead({
  //     abi: MarbleLsdV1.abi,
  //     address: MarbleLsdV1.address,
  //     functionName: "previewDeposit",
  //     args: [parseEther(stakeAmount)],
  //   });
  //
  // const { data: isDepositPaused, error: isDepositPausedError } =
  //   useContractRead({
  //     abi: MarbleLsdV1.abi,
  //     address: MarbleLsdV1.address,
  //     functionName: "isDepositPaused",
  //   });
  //
  // const previewDepositFormatted = previewDepositData
  //   ? formatEther(previewDepositData as unknown as bigint)
  //   : "0";

  // const {
  //   error: depositTxnError,
  //   isLoading: isDepositTxnInProgress,
  //   isSuccess: isDepositTxnSuccess,
  // } = useWaitForTransaction({
  //   hash: depositFundData?.hash,
  // });

  // async function submitStake() {
  //   if (isDepositTxnSuccess) {
  //     // redirect to main page
  //     push("/");
  //     return;
  //   }
  //   // additional checks to ensure that the user's wallet balance is sufficient to cover the deposit amount
  //   // ensure that the entered amount meets the min. deposit req defined by the contract's minDeposit Variable
  //
  //   if (isDepositPaused) {
  //     // TODO display popup
  //     console.log("Deposit is paused");
  //     // display message to user that deposit is paused
  //     return;
  //   }
  //   console.log("call stake");
  //   try {
  //     if (isDepositPaused) {
  //       // TODO display popups
  //       console.log("Deposit is paused");
  //       // display message to user that deposit is paused
  //       return;
  //     }
  //     writeDepositTxn?.();
  //   } catch (error) {
  //     console.error("Deposit failed:", error);
  //     // Handle error (e.g., display error message to user)
  //   }
  // }

  function getActionBtnLabel() {
    switch (true) {
      // case isDepositTxnSuccess:
      //   return "Return to Main Page";

      case isConnected:
        isConnected;
        return "Stake DFI";

      default:
        return "Connect wallet";
    }
  }

  useEffect(() => {
    setWalletBalanceAmount(walletBalance?.formatted ?? "NA"); // set wallet balance
    setIsWalletConnected(isConnected);
  }, [address, status, network, walletBalance]);

  useEffect(() => {
    console.log(walletBalanceAmount);
  }, [walletBalanceAmount]);

  return (
    <DialogueBox>
      <div className="grid gap-y-10">
        <div>
          <h3 className="text-2xl leading-7 font-semibold mb-11">Stake DFI</h3>
          <div className="flex items-center w-full justify-between mb-3">
            <span className="text-sm">How much do you want to stake?</span>
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
          <div className="gap-y-6 grid">
            <InputCard
              amount={stakeAmount}
              onChange={setStakeAmount}
              value={"0"}
              // disabled={isDepositInProgress || isDepositTxnInProgress}
              disabled={false}
              icon={
                <Image
                  data-testid="dfi-icon"
                  src="/icons/dfi-icon.svg"
                  alt="DFI icon"
                  className="min-w-6"
                  width={24}
                  height={24}
                  priority
                />
              }
              rhs={
                isWalletConnected ? (
                  <div
                    className="gap-x-1 flex bg-zinc-50 p-1 rounded-[20px]"
                    data-testid="percentage-btn"
                  >
                    {Object.values(AmountButton).map((percentage) => (
                      <PercentageButton
                        key={percentage}
                        percentage={percentage}
                        amount={new BigNumber(0)}
                        onClick={setStakeAmount}
                        // disabled={isDepositInProgress || isDepositTxnInProgress}
                        disabled={false}
                      />
                    ))}
                  </div>
                ) : null
              }
            />
            <div>
              <div className="flex w-full items-center justify-between mb-3">
                <span className="text-sm">Receiving address</span>
                <div className="flex items-center gap-x-2">
                  <span className="text-xs text-light-1000/50">
                    Use connected wallet
                  </span>
                  {/*<ToggleSwitch*/}
                  {/*  setOn={(newState) => {*/}
                  {/*    setIsUsingConnectedWallet(newState);*/}
                  {/*  }}*/}
                  {/*  isOn={isUsingConnectedWallet}*/}
                  {/*/>*/}
                </div>
              </div>
              <InputCard
                amount={stakeAmount}
                onChange={setStakeAmount}
                // disabled={isDepositInProgress || isDepositTxnInProgress}
                disabled={false}
              />
            </div>

            <section>
              <TransactionRow
                label="You will receive"
                // value={`${previewDepositFormatted} mDFI`}
                value={"0"}
              />
              <TransactionRow label="Exchange rate" value="1 mDFI = 1 DFI" />
              {/* TODO fee schedule*/}
              <TransactionRow label="Max transaction cost" value="$0.00" />
            </section>
            <ConnectKitButton.Custom>
              {({ show }) => (
                <CTAButton
                  testID="instant-transfer-btn"
                  label={getActionBtnLabel()}
                  customStyle="w-full md:py-5"
                  // isLoading={isDepositInProgress || isDepositTxnInProgress}
                  // disabled={isDepositInProgress || isDepositTxnInProgress}
                  // onClick={!isConnected ? show : () => submitStake()}
                />
              )}
            </ConnectKitButton.Custom>
          </div>
        </div>

        <Statistics />
      </div>
    </DialogueBox>
  );
}

function TransactionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-row justify-between py-[10px]">
      <span>{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}
