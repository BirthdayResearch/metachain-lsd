import clsx from "clsx";

export default function AddressInput({
  value,
  setValue,
  placeholder,
  customStyle,
  isDisabled,
}: {
  value: string;
  setValue: (text: string) => void;
  placeholder?: string;
  customStyle?: string;
  isDisabled?: boolean;
}) {
  return (
    <div>
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
          <input
            data-testid="receiver-address-input"
            disabled={isDisabled}
            className={clsx(
              "mr-6 w-full bg-light-00 disabled:bg-transparent caret-brand-100",
              "placeholder:text-light-1000/50 focus:outline-none",
            )}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </form>
      </div>
      {/* TODO display error msg*/}
      {/*{errorMsg && (*/}
      {/*  <div className="text-left mt-2 ml-2 text-sm text-red">{errorMsg}</div>*/}
      {/*)}*/}
    </div>
  );
}
