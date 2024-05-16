import { getDecimalPlace } from "@/lib/textHelper";
import clsx from "clsx";
import NumericFormat from "@/components/NumericFormat";
import BigNumber from "bignumber.js";

export default function WalletDetails({
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
