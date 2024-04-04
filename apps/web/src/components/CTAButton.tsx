import clsx from "clsx";

export function CTAButton({
  text,
  testID,
  customStyle,
  customTextStyle = "text-light-00",
  onClick,
  isDisabled = false,
}: {
  text: string;
  customStyle?: string;
  customTextStyle?: string;
  testID: string;
  onClick?: (e: any) => void;
  isDisabled?: boolean;
}) {
  return (
    <button
      disabled={isDisabled}
      data-testid={`cta-button-${testID}`}
      className={clsx(
        "primary-btn-ui px-9 py-5 md:py-4",
        "hover:bg-opacity-60",
        "disabled:opacity-30",
        customStyle ?? "w-fit",
      )}
      onClick={onClick}
    >
      <span
        className={clsx(
          "active:text-opacity-60 text-sm font-bold text-light-1000",
          customTextStyle,
        )}
      >
        {text}
      </span>
    </button>
  );
}
