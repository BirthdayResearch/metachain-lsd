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
    <h1
      data-testid={`section-title-${testID}`}
      className={clsx(
        "text-4xl text-center text-light-1000 md:leading-[104px] font-semibold md:-tracking-[1.92] md:text-8xl",
        customStyle ?? "w-fit",
      )}
    >
      {text}
    </h1>
  );
}
