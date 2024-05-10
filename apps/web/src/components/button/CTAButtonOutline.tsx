import clsx from "clsx";

export function CTAButtonOutline({
  label,
  testID,
  customStyle,
  customTextStyle = "text-light-00",
}: {
  label: string;
  customStyle?: string;
  customTextStyle?: string;
  testID: string;
  isOutline?: boolean;
}) {
  return (
    <button
      data-testid={`cta-button-outline-${testID}`}
      className={clsx(
        "rounded-[40px] px-8 md:px-9 py-4 border-[0.5px] border-light-1000 flex items-center justify-center",
        "text-[28px] font-bold",
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
