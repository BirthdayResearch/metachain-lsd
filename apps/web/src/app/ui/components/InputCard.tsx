"use client";

import Image from "next/image";
import { useState } from "react";
import clsx from "clsx";

enum AmountButton {
  TwentyFive = "25%",
  Half = "50%",
  SeventyFive = "75%",
  Max = "Max",
}

export function PercentageButton({ percentage }: { percentage: string }) {
  return (
    <button className="px-2">
      <span className="font-medium text-xs">{percentage}</span>
    </button>
  );
}

export function InputCard({
  amt,
  value,
  setAmt,
}: {
  amt: string;
  value: string;
  setAmt: (amt: string) => void;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <div
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
            value={amt}
            type="text"
            className="w-full rounded text-base outline-0"
            placeholder="0.00"
            onChange={(e) => {
              setAmt(e.target.value);
            }}
          />
          <span className="text-xs font-light">${value}</span>
        </div>
        {/*  Display only when wallet is connected*/}
        <div className="gap-x-1 flex">
          {Object.values(AmountButton).map((type) => (
            <PercentageButton key={type} percentage={type} />
          ))}
        </div>
      </div>
    </div>
  );
}
