import clsx from "clsx";

export function Tag({
  text,
  testId,
  customStyle,
  customTextStyle,
}: {
  text: string;
  customStyle?: string;
  customTextStyle?: string;
  testId: string;
}) {
  return (
    <div
      data-testid={`tag-${testId}`}
      className={clsx(
        "bg-light-00 rounded-[20px] py-2 px-4",
        "text-[10px] leading-3 font-bold tracking-wider",
        customTextStyle,
        customStyle ?? "w-fit",
      )}
    >
      {text}
    </div>
  );
}
