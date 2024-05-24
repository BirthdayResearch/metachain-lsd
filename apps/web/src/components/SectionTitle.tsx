import clsx from "clsx";

export function SectionTitle({
  text,
  customStyle,
  testId,
}: {
  text: string;
  customStyle?: string;
  testId: string;
}) {
  return (
    <h1
      data-testid={`section-title-${testId}`}
      className={clsx(
        "text-[40px] text-center text-light-1000 leading-[44px] md:leading-[88px] font-semibold md:text-7xl",
        customStyle ?? "w-fit",
      )}
    >
      {text}
    </h1>
  );
}
