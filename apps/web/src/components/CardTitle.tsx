import clsx from "clsx";

export function CardTitle({
  text,
  customStyle,
  testId,
}: {
  text: string;
  customStyle?: string;
  testId: string;
}) {
  return (
    <div
      data-testid={`card-title-${testId}`}
      className={clsx(
        "text-[28px] md:text-[40px] leading-10 md:leading-[56px] text-center font-semibold",
        customStyle ?? "w-fit",
      )}
    >
      {text}
    </div>
  );
}
