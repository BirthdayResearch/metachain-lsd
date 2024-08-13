import { useEffect } from "react";
import BigNumber from "bignumber.js";
import { PercentageButton } from "@/app/app/components/PercentageButton";
import NumericFormat from "@/components/NumericFormat";
import { getDecimalPlace } from "@/lib/textHelper";
import clsx from "clsx";

export function InputCard({
  maxAmount,
  minAmount,
  value,
  usdAmount,
  setAmount,
  error,
  setError,
  isConnected,
  children,
}: {
  maxAmount: BigNumber; // to calculate amount
  minAmount: BigNumber;
  value: string; // to display amount in UI
  usdAmount: BigNumber;
  setAmount: (amount: string) => void;
  error: string | null;
  setError: (msg: string | null) => void;
  isConnected: boolean;
  children: JSX.Element;
}) {
  useEffect(() => {
    if (value !== "") {
      if (isNaN(Number(value)) || new BigNumber(value).lte(0)) {
        return setError("Please enter a valid number.");
      }
      if (new BigNumber(value).isGreaterThan(maxAmount ?? 0)) {
        return setError("Insufficient balance, please enter a valid number.");
      }
      if (new BigNumber(value).isLessThan(minAmount ?? 0)) {
        let formattedNumber = new BigNumber(minAmount).toFormat({
          decimalSeparator: ".",
          groupSeparator: ",",
          groupSize: 3,
        });
        return setError(
          `Entered amount must be at least ${formattedNumber} DFI.`,
        );
      }
    }
    setError(null);
  }, [value]);

  return (
    <section>
      <div
        className={clsx(
          "hover:accent-1 p-[1px] rounded-md",
          value && error ? "bg-red" : "",
        )}
      >
        <figure
          className={clsx(
            "flex flex-col md:flex-row justify-between",
            "gap-y-3 gap-x-6 bg-white p-4 md:pl-6 rounded-md md:items-center",
          )}
        >
          <div className="flex flex-row gap-x-3 flex-1 max-w-64 lg:max-w-80">
            <div className="flex flex-row justify-center items-center text-center">
              {children}
            </div>
            <div className="flex flex-col w-full">
              <input
                data-testid="input-card-amount"
                value={value}
                type="number"
                min="0"
                className="w-full rounded text-base outline-0"
                placeholder="0.00"
                onChange={(e) => setAmount(e.target.value)}
              />
              <NumericFormat
                className="text-xs font-light break-all"
                prefix="$"
                value={usdAmount}
                decimalScale={getDecimalPlace(usdAmount)}
              />
            </div>
          </div>
          {isConnected && (
            <PercentageButton
              onClickRecalculateAmount={setAmount}
              maxAmount={maxAmount}
            />
          )}
        </figure>
      </div>
      {error && isConnected && (
        <p className="text-left mt-2 text-sm text-red">{error}</p>
      )}
    </section>
  );
}
