import { useState } from "react";
import clsx from "clsx";
import BigNumber from "bignumber.js";

export function InputCard({
  amount,
  value,
  onChange,
  disabled = false,
  icon,
  customStyle,
  rhs,
}: {
  amount: string;
  value?: string;
  onChange: (amt: string) => void;
  disabled: boolean;
  icon?: React.ReactNode;
  customStyle?: string;
  rhs?: React.ReactNode;
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
        {rhs}
      </div>
    </div>
  );
}
