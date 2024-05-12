import clsx from "clsx";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { FiCopy } from "react-icons/fi";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import { useEffect, useRef, useState } from "react";
import { isAddress } from "ethers";

export function SuccessCopy({
  containerClass,
  show,
}: {
  containerClass: string;
  show: boolean;
}) {
  return (
    <div
      className={clsx(
        "absolute md:w-full text-center",
        show ? "opacity-100" : "opacity-0",
        containerClass,
      )}
    >
      <span className="rounded bg-green px-2 py-1 text-xs text-dark-00  transition duration-300 md:text-xs">
        Copied to clipboard
      </span>
    </div>
  );
}

export default function AddressInput({
  value,
  setValue,
  receivingWalletAddress,
  setEnableConnectedWallet,
  placeholder,
  customStyle,
  isDisabled,
  error,
  setError,
}: {
  value?: `0x${string}` | string;
  setValue: (text: `0x${string}` | string) => void;
  receivingWalletAddress?: `0x${string}`;
  setEnableConnectedWallet: (enableConnectedWallet: boolean) => void;
  placeholder?: string;
  customStyle?: string;
  isDisabled?: boolean;
  error: string | null;
  setError: (msg: string | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const onButtonClick = () => {
    if (ref.current) {
      ref.current.focus();
    }
  };
  const { copy } = useCopyToClipboard();
  const [showSuccessCopy, setShowSuccessCopy] = useState(false);

  const handleOnCopy = (text: string | undefined) => {
    if (text) {
      copy(text);
      setShowSuccessCopy(true);
    }
  };

  useEffect(() => {
    if (showSuccessCopy) {
      setTimeout(() => setShowSuccessCopy(false), 2000);
    }
  }, [showSuccessCopy]);

  useEffect(() => {
    const isValidAddress = isAddress(value);
    if (value !== "" && !isValidAddress) {
      return setError("Enter a valid wallet address");
    }
    return setError(null);
  }, [value]);

  return (
    <div onClick={onButtonClick}>
      <SuccessCopy
        containerClass="m-auto right-0 left-0 top-5"
        show={showSuccessCopy}
      />
      <div
        className={clsx(
          "border border-light-1000/10 rounded-md flex relative w-full",
          { "input-gradient-1": !isDisabled },
          value && error ? "bg-red" : "",
        )}
      >
        <form
          className={clsx(
            "relative w-full py-4 px-3 pl-6 flex items-center bg-light-00 rounded-md",
            customStyle,
            { "bg-opacity-30 ": isDisabled },
          )}
        >
          <div className="flex flex-row justify-between w-full items-center">
            <div className="flex justify-start items-center w-full">
              <div className="flex justify-start flex-row items-center">
                <input
                  ref={ref}
                  data-testid="receiver-address-input"
                  disabled={isDisabled}
                  className={clsx(
                    "truncate min-w-56 md:min-w-[25rem]",
                    "w-full bg-light-00 disabled:bg-transparent caret-brand-100",
                    "placeholder:text-light-1000/50 focus:outline-none",
                  )}
                  type="text"
                  placeholder={placeholder}
                  value={value ?? ""}
                  onChange={(e) => {
                    setValue(e.target.value);
                    if (receivingWalletAddress) {
                      setEnableConnectedWallet(
                        e.target.value === receivingWalletAddress,
                      );
                    }
                  }}
                />
                {value && !error && (
                  <AiFillCheckCircle size={16} className="text-green" />
                )}
                {value && error && (
                  <AiFillCloseCircle size={16} className="text-red" />
                )}
              </div>
            </div>
            {!isDisabled && (
              <div className="p-2 cursor-pointer">
                <FiCopy
                  size={16}
                  onClick={() => handleOnCopy(value)}
                  className="text-dark-00"
                />
              </div>
            )}
          </div>
        </form>
      </div>
      {error && <p className="text-left mt-2 text-sm text-red">{error}</p>}
    </div>
  );
}
