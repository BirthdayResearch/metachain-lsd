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

export function InputCard({
  amount,
  value,
  onChange,
  displayPercentageBtn,
  maxAmount,
  disabled = false,
  icon,
  customStyle,
}: {
  amount: string;
  value?: string;
  onChange: (amt: string) => void;
  displayPercentageBtn: boolean;
  maxAmount: BigNumber;
  disabled: boolean;
  icon?: React.ReactNode;
  customStyle?: string;
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
      <div
        className={clsx(
          "flex flex-row justify-between gap-x-6 bg-white p-6 rounded-[10px] items-center",
          customStyle,
        )}
      >
        <div className="flex justify-center items-center text-center">
          {icon}
        </div>
        <div className="flex flex-col w-full">
          <input
            disabled={disabled}
            data-testid="input-amount"
            value={amount}
            type="number"
            className="w-full rounded text-base outline-0 caret-green"
            placeholder="0.00"
            onChange={(e) => {
              onChange(e.target.value);
            }}
          />
          {value && <span className="text-xs font-light">${value}</span>}
        </div>
        {displayPercentageBtn ? (
          <div
            className="gap-x-1 flex bg-zinc-50 p-1 rounded-[20px]"
            data-testid="percentage-btn"
          >
            {Object.values(AmountButton).map((percentage) => (
              <PercentageButton
                key={percentage}
                percentage={percentage}
                amount={maxAmount}
                onClick={onChange}
                disabled={disabled}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
