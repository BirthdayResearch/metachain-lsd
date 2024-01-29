import clsx from "clsx";

export function Tag({
  text,
  testID,
  customStyle,
  customTextStyle,
}: {
  text: string;
  customStyle?: string;
  customTextStyle?: string;
  testID: string;
}) {
  return (
    <div
      data-testid={`tag-${testID}`}
      className={clsx(
        "bg-light-00 rounded-[20px] py-2 px-4",
        "font-mono text-[10px] leading-3 font-bold tracking-wider",
        customTextStyle,
        customStyle ?? "w-fit",
      )}
    >
      {text}
    </div>
  );
}
