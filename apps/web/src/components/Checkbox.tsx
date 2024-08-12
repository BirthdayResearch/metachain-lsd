"use client";

import clsx from "clsx";
import { forwardRef, Ref } from "react";
import Image from "next/image";

interface CheckboxProps {
  isChecked: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

const Checkbox = forwardRef(
  (
    { isChecked, isDisabled, onClick }: CheckboxProps,
    ref: Ref<HTMLButtonElement>,
  ) => (
    <button
      ref={ref}
      className={clsx("w-6 h-6 border rounded shrink-0", {
        "border-light-1000/10": !isChecked,
        "bg-[#16E544] border-[#16E544] hover:border hover:border-dark-1000 active:border-brand-300":
          isChecked,
        "hover:border-light-1000/20": !isDisabled && !isChecked,
      })}
      type="button"
      onClick={onClick}
      disabled={isDisabled}
    >
      <Image
        src="/check.svg"
        alt="check"
        width={13.33}
        height={9.17}
        className={clsx("text-dark-1000 m-auto", { hidden: !isChecked })}
      />
    </button>
  ),
);
Checkbox.displayName = "Checkbox";

export default Checkbox;
