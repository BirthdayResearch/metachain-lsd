import clsx from "clsx";

export function SecondaryButton({
  text,
  testID,
  customStyle,
  customTextStyle = "text-light-00",
}: {
  text: string;
  customStyle?: string;
  customTextStyle?: string;
  testID: string;
  isOutline?: boolean;
}) {
  return (
    <button
      data-testid={`secondary-button-${testID}`}
      className={clsx(
        "border border-light-1000 rounded-[30px] px-9 py-5 md:py-4",
        "border-light-1000 hover:border-brand-100 active:text-opacity-60",
        "text-sm font-bold text-light-1000",
        customTextStyle,
        customStyle ?? "w-fit"
      )}
    >
      {text}
    </button>
  );
}
