import clsx from "clsx";
import { AiFillCheckCircle } from "react-icons/ai";
import { FiCopy } from "react-icons/fi";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import { useEffect, useState } from "react";

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
}: {
  value?: `0x${string}` | string;
  setValue: (text: `0x${string}` | string) => void;
  receivingWalletAddress?: `0x${string}`;
  setEnableConnectedWallet: (enableConnectedWallet: boolean) => void;
  placeholder?: string;
  customStyle?: string;
  isDisabled?: boolean;
}) {
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
  return (
    <div>
      <SuccessCopy
        containerClass="m-auto right-0 left-0 top-5"
        show={showSuccessCopy}
      />
      <div
        className={clsx(
          "border border-light-1000/10 rounded-[10px] flex relative w-full",
          // value && !isValidEmail(value) ? "bg-red" : "input-gradient-1",
          { "input-gradient-1": !isDisabled },
        )}
      >
        <form
          className={clsx(
            "relative w-full py-4 px-3 pl-6 flex items-center bg-light-00 rounded-[10px]",
            customStyle,
            { "bg-opacity-30 ": isDisabled },
          )}
        >
          <div className="flex justify-between w-full items-center">
            <div className="flex items-center">
              <div className="w-full flex items-center">
                <input
                  data-testid="receiver-address-input"
                  disabled={isDisabled}
                  className={clsx(
                    "truncate min-w-56 md:min-w-[26rem] w-full bg-light-00 disabled:bg-transparent caret-brand-100",
                    "placeholder:text-light-1000/50 focus:outline-none",
                  )}
                  type="text"
                  placeholder={placeholder}
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                    if (receivingWalletAddress) {
                      setEnableConnectedWallet(
                        e.target.value === receivingWalletAddress,
                      );
                    }
                  }}
                />
                {value === receivingWalletAddress && (
                  <AiFillCheckCircle size={16} className="text-green" />
                )}
              </div>
            </div>
            <div className="p-2">
              <FiCopy size={16} onClick={() => handleOnCopy(value)} />
            </div>
          </div>
        </form>
      </div>
      {/* TODO display error msg*/}
      {/*{errorMsg && (*/}
      {/*  <div className="text-left mt-2 ml-2 text-sm text-red">{errorMsg}</div>*/}
      {/*)}*/}
    </div>
  );
}
