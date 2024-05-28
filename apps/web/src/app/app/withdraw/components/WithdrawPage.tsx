import Panel from "@/app/app/stake/components/Panel";
import { InputCard } from "@/app/app/components/InputCard";
import BigNumber from "bignumber.js";
import TransactionRow from "@/app/app/withdraw/components/TransactionRow";
import { ConnectKitButton } from "connectkit";
import React from "react";
import { useAccount } from "wagmi";
import Image from "next/image";
import ComplimentarySection from "@/app/app/withdraw/components/ComplimentarySection";
import WalletDetails from "@/app/app/components/WalletDetails";
import { CTAButton } from "@/components/button/CTAButton";

export default function WithdrawPage({
  walletBalanceAmount,
  amountError,
  setAmountError,
  minDepositAmount,
  withdrawAmount,
  setWithdrawAmount,
}: {
  walletBalanceAmount: string;
  amountError: string | null;
  setAmountError: React.Dispatch<React.SetStateAction<string | null>>;
  minDepositAmount: string;
  withdrawAmount: string;
  setWithdrawAmount: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { isConnected } = useAccount();

  function getActionBtnLabel() {
    switch (true) {
      // case isSuccess: previewWithdrawal
      //   return "Return to Main Page";

      case isConnected:
        return "Withdraw mDFI";

      default:
        return "Connect wallet";
    }
  }
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
              <div className="flex flex-col gap-y-1">
                <TransactionRow label="You will receive" value="0.00 mDFI" />
                <TransactionRow label="Exchange rate" value="1 mDFI = 1 DFI" />
                <TransactionRow label="Max transaction cost" value="$0.00" />
              </div>
              <span className="block my-2 w-full border-dark-00/10 border-t-[0.5px]" />
              <div className="flex flex-col gap-y-1">
                <TransactionRow
                  label="Total liquidity"
                  tooltipText="Total amount available for withdrawal."
                  value="133,939 DFI"
                  secondaryValue="$3.23"
                />
                <TransactionRow label="Annual rewards" value="3.34%" />
              </div>
            </div>
          </div>
          <ConnectKitButton.Custom>
            {({ show }) => (
              <CTAButton
                testId="instant-transfer-btn"
                label={isConnected ? "Withdraw mDFI" : "Connect wallet"}
                customStyle="w-full md:py-5"
              />
            )}
          </ConnectKitButton.Custom>
        </div>
        <ComplimentarySection />
      </div>
    </Panel>
  );
}
