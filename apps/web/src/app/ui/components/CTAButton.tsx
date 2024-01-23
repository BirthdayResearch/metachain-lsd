import clsx from "clsx";

export function CTAButton({
  text,
  testID,
  customStyle,
  customTextStyle = "text-light-00",
}: {
  text: string;
  customStyle?: string;
  customTextStyle?: string;
  testID: string;
}) {
  return (
    <button
      data-testid={`cta-button-${testID}`}
      className={clsx(
        "px-16 py-6 bg-dark-1000 rounded-[59px]",
        "text-[28px] font-bold",
        customTextStyle,
        customStyle ?? "w-fit",
      )}
    >
      {text}
    </button>
  );
}
