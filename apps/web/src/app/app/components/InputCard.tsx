import Image from "next/image";
import { useEffect } from "react";
import BigNumber from "bignumber.js";
import { PercentageButton } from "@/app/app/components/PercentageButton";
import { useDfiPrice } from "@/hooks/useDfiPrice";
import NumericFormat from "@/components/NumericFormat";
import { getDecimalPlace } from "@/lib/textHelper";
import clsx from "clsx";

export function InputCard({
  maxAmount,
  minAmount,
  value,
  setAmount,
  error,
  setError,
}: {
  maxAmount: BigNumber; // to calculate amount
  minAmount: BigNumber;
  value: string; // to display amount in UI
  setAmount: (amount: string) => void;
  error: string | null;
  setError: (msg: string | null) => void;
}) {
  const dfiPrice = useDfiPrice();

  useEffect(() => {
    if (value !== "") {
      if (isNaN(Number(value)) || new BigNumber(value).lte(0)) {
        return setError("Please enter a valid number");
      }
      if (new BigNumber(value).isGreaterThan(maxAmount ?? 0)) {
        return setError("Insufficient balance, please enter a valid number");
      }
      if (new BigNumber(value).isLessThan(minAmount ?? 0)) {
        return setError(
          "Amount is less than minimum deposit amount, please enter a valid number",
        );
      }
    }
    setError(null);
  }, [value]);

  const usdAmount = new BigNumber(value).isNaN()
    ? new BigNumber(0)
    : new BigNumber(value ?? 0).multipliedBy(dfiPrice);

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
          <div className="flex flex-row gap-x-3 flex-1">
            <div className="flex flex-row justify-center items-center text-center">
              <Image
                data-testid="dfi-icon"
                src="/icons/dfi-icon.svg"
                alt="DFI icon"
                className="min-w-6"
                width={24}
                height={24}
                priority
              />
            </div>
            <div className="flex flex-col w-full">
              <input
                data-testid={`input-card-amount`}
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
          {/*  Display only when wallet is connected*/}
          <PercentageButton
            onClickRecalculateAmount={setAmount}
            maxAmount={maxAmount}
          />
        </figure>
      </div>
      {error && <p className="text-left mt-2 text-sm text-red">{error}</p>}
    </section>
  );
}
