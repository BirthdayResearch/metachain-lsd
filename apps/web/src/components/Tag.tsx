import clsx from "clsx";

export function Tag({
  text,
  Icon,
  testId,
  customStyle,
  customTextStyle,
}: {
  text: string;
  Icon?: JSX.Element;
  customStyle?: string;
  customTextStyle?: string;
  testId: string;
}) {
  return (
    <div
      data-testid={`tag-${testId}`}
      className={clsx(
        "flex gap-x-1 items-center bg-light-1000/[0.03]",
        "bg-light-00 rounded-[20px] px-4",
        "text-[10px] leading-3 font-bold tracking-wider",
        customTextStyle,
        customStyle ?? "w-fit py-2",
      )}
    >
      {Icon}
      {text}
    </div>
  );
}
