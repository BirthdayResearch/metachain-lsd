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
    <h3
      data-testid={`card-title-${testID}`}
      className={clsx(
        "text-5xl leading-[56px] text-center font-normal -tracking-[0.02em]",
        customStyle ?? "w-fit",
      )}
    >
      {text}
    </h3>
  );
}
