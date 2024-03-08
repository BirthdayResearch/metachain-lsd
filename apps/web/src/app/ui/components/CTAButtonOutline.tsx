import clsx from "clsx";

export function CTAButtonOutline({
  text,
  testID,
  customStyle,
  customTextStyle = "text-light-00",
  isOutline = false,
}: {
  text: string;
  customStyle?: string;
  customTextStyle?: string;
  testID: string;
  isOutline?: boolean;
}) {
  return (
    <button
      data-testid={`cta-button-outline-${testID}`}
      className={clsx(
        "px-16 py-6 cta-button-outline",
        "text-[28px] font-bold",
        customTextStyle,
        customStyle ?? "w-fit"
      )}
    >
      {text}
    </button>
  );
}
