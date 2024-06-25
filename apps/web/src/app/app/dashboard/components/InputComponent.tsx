import clsx from "clsx";
import React, { useState } from "react";
import { IoCloseCircleSharp } from "react-icons/io5";

interface InputProps {
  label?: string;
  value: string | number;
  type?: string;
  setValue: (value: string | number) => void;
  error?: string;
  errorClass?: string;
  disabled?: boolean;
  inputClass?: string;
  labelClassName?: string;
  showClearIcon?: boolean;
  inputContainerClassName?: string;
  placeholder: string;
}

const InputComponent = ({
  label,
  value,
  error,
  setValue,
  inputClass,
  placeholder,
  labelClassName,
  errorClass,
  type = "string",
  disabled = false,
  showClearIcon = true,
  inputContainerClassName,
}: InputProps) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isVisited, setIsVisited] = useState<boolean>(false);
  return (
    <div>
      {label && (
        <div className={clsx("text-lg mb-2 text-light-700", labelClassName)}>
          {label}
        </div>
      )}
      <div
        className={clsx(
          "flex flex-row justify-between px-4 py-[18px] rounded-[10px] border-[0.5px] bg-light-100 border-light-300 focus-within:border focus-within:border-light-400",
          { "!border !border-red-800": error && isVisited },
          inputContainerClassName,
        )}
      >
        <input
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={(v) => setValue(v.target.value)}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            setIsVisited(true);
          }}
          className={clsx(
            "w-full focus:outline-none border-none text-light-700 placeholder-light-500 bg-light-100",
            { "opacity-[0.3]": disabled },
            inputClass,
          )}
        />
        {showClearIcon && (value !== "" || isFocused) && (
          <IoCloseCircleSharp
            onClick={() => {
              setValue("");
            }}
            role="button"
            className="text-light-700 ml-1"
            size={20}
          />
        )}
      </div>
      {error && isVisited && (
        <div className={clsx("text-red mt-2", errorClass)}>{error}</div>
      )}
    </div>
  );
};

export default InputComponent;
