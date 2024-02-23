import clsx from "clsx";

export function CTAButton({
  label,
  testID,
  customStyle,
  customTextStyle = "text-light-00",
  onClick,
  disabled,
}: {
  label: string;
  testID: string;
  disabled?: boolean;
  onClick?: () => void;
  customStyle?: string;
  customTextStyle?: string;
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
        {label}
      </span>
    </button>
  );
}
