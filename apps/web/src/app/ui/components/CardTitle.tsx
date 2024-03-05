import clsx from "clsx";

export function CardTitle({
  text,
  customStyle,
  testID,
}: {
  text: string;
  customStyle?: string;
  testID: string;
}) {
  return (
    <div
      data-testid={`card-title-${testID}`}
      className={clsx(
        "text-[28px] md:text-[40px] leading-10 md:leading-[56px] text-center font-semibold",
        customStyle ?? "w-fit",
      )}
    >
      {text}
    </div>
  );
}
