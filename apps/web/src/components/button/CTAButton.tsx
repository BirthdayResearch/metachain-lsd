import clsx from "clsx";
import Spinner from "@/components/Spinner";

export function CTAButton({
  label,
  testID,
  customStyle,
  customTextStyle = "text-light-00",
  onClick,
  disabled,
  isLoading = false,
}: {
  label: string;
  testID: string;
  disabled?: boolean;
  onClick?: () => void;
  customStyle?: string;
  customTextStyle?: string;
  isLoading?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      data-testid={`cta-button-${testID}`}
      className={clsx(
        "accent-1 rounded-[30px] px-9 py-5 md:py-4",
        !disabled && "hover:bg-opacity-60",
        customTextStyle,
        disabled ? "opacity-70" : "",
        customStyle ?? "w-fit",
      )}
    >
      <div className="items-center justify-center flex flex-row gap-x-3">
        <span className="active:text-opacity-60 text-sm font-bold text-light-1000">
          {label}
        </span>
        {isLoading ? <Spinner className="animate-spin w-5 h-5" /> : null}
      </div>
    </button>
  );
}
