import clsx from "clsx";

export function CTAButton({
  text,
  testID,
  customStyle,
  customTextStyle = "text-light-00",
  onClick,
  disabled,
}: {
  text: string;
  customStyle?: string;
  customTextStyle?: string;
  testID: string;
  onClick?: () => void;
  disabled: boolean;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      data-testid={`cta-button-${testID}`}
      className={clsx(
        "primary-btn-ui px-9 py-5 md:py-4",
        "hover:bg-opacity-60",
        customTextStyle,
        customStyle ?? "w-fit",
      )}
    >
      <span className="active:text-opacity-60 text-sm font-bold text-light-1000">
        {text}
      </span>
    </button>
  );
}
