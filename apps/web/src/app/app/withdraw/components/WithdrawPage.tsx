import Image from "next/image";
import { useAccount, useBalance, useReadContract } from "wagmi";
import React, { useEffect, useMemo } from "react";
import { ConnectKitButton } from "connectkit";
import { CTAButton } from "@/components/button/CTAButton";
import Panel from "@/app/app/stake/components/Panel";
import { InputCard } from "@/app/app/components/InputCard";
import WalletDetails from "@/app/app/components/WalletDetails";
import ComplimentarySection from "@/app/app/withdraw/components/ComplimentarySection";
import BigNumber from "bignumber.js";
import { formatEther } from "ethers";
import { NumericTransactionRow } from "@/app/app/components/NumericTransactionRow";
import { getDecimalPlace, toWei } from "@/lib/textHelper";
import TransactionRows from "@/app/app/stake/components/TransactionRows";
import { useContractContext } from "@/context/ContractContext";
import { useDfiPrice } from "@/hooks/useDfiPrice";

export default function WithdrawPage({
  walletBalanceAmount,
  amountError,
  setAmountError,
  minDepositAmount,
  withdrawAmount,
  setWithdrawAmount,
  setWalletBalanceAmount,
  isPending,
  submitWithdraw,
  previewWithdrawal,
}: {
  walletBalanceAmount: string;
  amountError: string | null;
  setAmountError: React.Dispatch<React.SetStateAction<string | null>>;
  minDepositAmount: string;
  withdrawAmount: string;
  setWithdrawAmount: React.Dispatch<React.SetStateAction<string>>;
  setWalletBalanceAmount: React.Dispatch<React.SetStateAction<string>>;
  isPending: boolean;
  submitWithdraw: () => void;
  previewWithdrawal: string;
}) {
  const { address, isConnected, status, chainId } = useAccount();
  const { MarbleLsdProxy, mDFI } = useContractContext();
  const dfiPrice = useDfiPrice();

  const { data: walletBalance } = useBalance({
    address,
    chainId,
    // token: mDFI.address,
  });

  const { data: totalAssetsData } = useReadContract({
    address: MarbleLsdProxy.address,
    abi: MarbleLsdProxy.abi,
    functionName: "totalAssets",
    query: {
      enabled: isConnected,
    },
  });

  // To calculate and display the USD amount of total assets
  const totalAssets = useMemo(() => {
    return formatEther((totalAssetsData as number) ?? 0).toString();
  }, [totalAssetsData]);
  const totalAssetsUsdAmount = new BigNumber(totalAssets).isNaN()
    ? new BigNumber(0)
    : new BigNumber(totalAssets ?? 0).multipliedBy(dfiPrice);

  const balance = formatEther(walletBalance?.value.toString() ?? "0");

  const isDisabled = isPending || !withdrawAmount || !!amountError;

  useEffect(() => {
    setWalletBalanceAmount(balance); // set wallet balance
  }, [address, status, walletBalance]);

  return (
    <Panel>
      <div>
        <div className="w-full gap-y-5">
          <h3 className="text-2xl font-semibold">Withdraw DFI</h3>
          <div className="flex flex-col w-full justify-between gap-y-5">
            <div className="mt-10 md:mt-7 lg:mt-10">
              <div className="mb-5">
                <div className="flex items-center justify-between gap-y-2 mb-2">
                  <span className="text-xs md:text-sm py-1">
                    How much do you want to withdraw?
                  </span>
                  <WalletDetails
                    walletBalanceAmount={walletBalanceAmount}
                    isWalletConnected={isConnected}
                    style="md:block hidden"
                    isMdfi
                  />
                </div>
              </div>
              <div className="grid gap-y-2">
                <InputCard
                  isConnected={isConnected}
                  maxAmount={new BigNumber(walletBalanceAmount)}
                  minAmount={new BigNumber(minDepositAmount)}
                  error={amountError}
                  setError={setAmountError}
                  value={withdrawAmount}
                  setAmount={setWithdrawAmount}
                >
                  <Image
                    data-testid="mdfi-icon"
                    src="/icons/mdfi-icon.svg"
                    alt="MDFI icon"
                    className="min-w-6"
                    priority
                    width={24}
                    height={24}
                  />
                </InputCard>
                <WalletDetails
                  walletBalanceAmount={walletBalanceAmount}
                  isWalletConnected={isConnected}
                  style="block md:hidden"
                />
              </div>
            </div>
            <div className="mb-10 md:mb-7 lg:mb-10">
              <TransactionRows previewDetails={previewWithdrawal} />
              {isConnected && (
                <>
                  <span className="block my-2 w-full border-dark-00/10 border-t-[0.5px]" />
                  <div className="flex flex-col gap-y-1">
                    <NumericTransactionRow
                      label="Total liquidity"
                      tooltipText="Total amount available for withdrawal."
                      value={{
                        value: totalAssets,
                        suffix: " DFI",
                        decimalScale: getDecimalPlace(totalAssets),
                      }}
                      secondaryValue={{
                        value: totalAssetsUsdAmount,
                        decimalScale: getDecimalPlace(totalAssetsUsdAmount),
                        prefix: "$",
                      }}
                    />
                    <NumericTransactionRow
                      label="Annual rewards"
                      value={{
                        value: 3.34,
                        suffix: "%",
                        decimalScale: getDecimalPlace(3.34),
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          {isConnected ? (
            <CTAButton
              isDisabled={isDisabled}
              isLoading={isPending}
              testId="withdraw-mdfi-btn"
              label="Withdraw mDFI"
              customStyle="w-full md:py-5"
              onClick={submitWithdraw}
            />
          ) : (
            <ConnectKitButton.Custom>
              {({ show }) => (
                <CTAButton
                  testId="instant-transfer-btn"
                  label={"Connect wallet"}
                  customStyle="w-full md:py-5"
                  onClick={show}
                />
              )}
            </ConnectKitButton.Custom>
          )}
        </div>
        <ComplimentarySection />
      </div>
    </Panel>
  );
}
