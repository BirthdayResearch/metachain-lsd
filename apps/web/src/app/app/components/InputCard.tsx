import Image from "next/image";
import { useState } from "react";
import clsx from "clsx";

export function InputCard({
  maxAmount,
  usdAmount,
  setAmount,
}: {
  maxAmount: string;
  usdAmount: string;
  setAmount: (amount: string) => void;
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
        className={clsx(
          "hover:accent-1 p-0.5 rounded-[10px]",
          focus && "accent-1",
        )}
      >
        <div className="flex flex-row justify-between gap-x-6 bg-white px-6 py-4 rounded-[10px] items-center">
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
              value={maxAmount}
              type="text"
              className="w-full rounded text-base outline-0"
              placeholder="0.00"
              onChange={handleInputChange}
            />
            <span className="text-xs font-light">${usdAmount}</span>
          </div>
        </div>
      </div>
      {errorMsg && (
        <p className="text-left mt-2 text-sm text-red">{errorMsg}</p>
      )}
    </section>
  );
}
