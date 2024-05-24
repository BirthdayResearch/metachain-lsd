import clsx from "clsx";

export function CTAButtonOutline({
  label,
  testId,
  customStyle,
  onClick,
  isDisabled,
  customTextStyle = "text-light-00",
}: {
  label: string;
  customStyle?: string;
  customTextStyle?: string;
  testId: string;
  isDisabled?: boolean;
  onClick: () => void;
  isOutline?: boolean;
}) {
  return (
    <button
      data-testid={`cta-button-outline-${testId}`}
      className={clsx(
        "rounded-[40px] px-8 md:px-9 py-4 border-[0.5px] border-light-1000 flex items-center justify-center",
        "text-[28px] font-bold",
        !isDisabled && "hover:bg-opacity-60",
        customTextStyle,
        isDisabled ? "opacity-30" : "",
        customStyle ?? "w-fit",
      )}
      disabled={isDisabled}
      onClick={onClick}
    >
      <span className="active:text-opacity-60 text-sm font-bold text-light-1000">
        {label}
      </span>
    </button>
  );
}
