import clsx from "clsx";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { FiCopy } from "react-icons/fi";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import { useEffect, useRef } from "react";
import { isAddress } from "ethers";
import toast from "react-hot-toast";

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
  receivingWalletAddress?: `0x${string}` | string | undefined;
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

  const handleOnCopy = (text: string | undefined) => {
    if (text) {
      copy(text);
      toast("Copied to clipboard", {
        duration: 1000,
        className:
          "bg-green px-2 py-1 !text-xs !text-dark-00 !bg-green mt-10 !rounded-md",
        id: "copy",
      });
    }
  };

  useEffect(() => {
    const isValidAddress = isAddress(value);
    if (value !== "" && !isValidAddress) {
      return setError("Enter a valid wallet address");
    }
    return setError(null);
  }, [value]);

  return (
    <div onClick={onButtonClick}>
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
