import clsx from "clsx";
export function SectionTitle({
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
      data-testid={`section-title-${testID}`}
      className={clsx(
        "text-8xl text-center leading-[104px] font-normal -tracking-[1.92]",
        customStyle ?? "w-fit",
      )}
    >
      {text}
    </h3>
  );
}
