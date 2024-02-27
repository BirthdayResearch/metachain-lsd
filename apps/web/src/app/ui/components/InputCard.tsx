import Image from "next/image";
import { useState } from "react";
import clsx from "clsx";
import BigNumber from "bignumber.js";

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
}: {
  percentage: AmountButton;
  amount: BigNumber;
  onClick: (amount: string) => void;
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
      className="px-2"
      onClick={(): void => {
        onClick(value);
      }}
    >
      <span className="font-medium text-xs">{percentage}</span>
    </button>
  );
}

export function InputCard({
  amount,
  value,
  onChange,
  displayPercentageBtn,
  maxAmount,
}: {
  amount: string;
  value: string;
  onChange: (amt: string) => void;
  displayPercentageBtn: boolean;
  maxAmount: BigNumber;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <div
      data-testid="input-card"
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      className={clsx(
        "hover:accent-1 p-0.5 rounded-[10px]",
        focus && "accent-1",
      )}
    >
      <div className="flex flex-row justify-between gap-x-6 bg-white p-6 rounded-[10px] items-center">
        <div className="flex justify-center items-center text-center">
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
            value={amount}
            type="text"
            className="w-full rounded text-base outline-0"
            placeholder="0.00"
            onChange={(e) => {
              onChange(e.target.value);
            }}
          />
          <span className="text-xs font-light">${value}</span>
        </div>
        {displayPercentageBtn ? (
          <div className="gap-x-1 flex">
            {Object.values(AmountButton).map((percentage) => (
              <PercentageButton
                key={percentage}
                percentage={percentage}
                amount={maxAmount}
                onClick={onChange}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
