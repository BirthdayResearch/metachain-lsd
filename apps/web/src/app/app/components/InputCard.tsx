import Image from "next/image";
import { useState } from "react";
import clsx from "clsx";
import BigNumber from "bignumber.js";
import { PercentageButton } from "@/app/app/components/PercentageButton";

export function InputCard({
  maxAmount,
  value,
  usdAmount,
  setAmount,
  onChange,
}: {
  maxAmount: BigNumber; // to calculate amount
  value: string; // to display amount in UI
  setAmount: (amount: string) => void;
  usdAmount: string;
  onChange: (amount: string) => void;
}) {
  const [focus, setFocus] = useState(false);
  const [errorMsg, setErrorMsg] = useState<String | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setAmount("");
      setErrorMsg(null);
      return;
    }
    if (isNaN(Number(value))) {
      setErrorMsg("Please enter a valid number");
      return;
    }
    setAmount(value);
    setErrorMsg(null);
  };

  return (
    <section>
      <div
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className={clsx("hover:accent-1 p-0.5 rounded-md", focus && "accent-1")}
      >
        <figure className="flex flex-col md:flex-row justify-between gap-y-3 gap-x-6 bg-white p-4 pl-6 rounded-md md:items-center">
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
                className="w-full rounded text-base outline-0"
                placeholder="0.00"
                onChange={handleInputChange}
              />
              <span className="text-xs font-light break-all">${usdAmount}</span>
            </div>
          </div>
          {/*  Display only when wallet is connected*/}
          <PercentageButton
            onClickRecalculateAmount={onChange}
            maxAmount={maxAmount}
          />
        </figure>
      </div>
      {errorMsg && (
        <p className="text-left mt-2 text-sm text-red">{errorMsg}</p>
      )}
    </section>
  );
}
