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
        "text-4xl text-center text-light-1000 leading-[44px] md:leading-[88px] font-semibold md:text-7xl",
        customStyle ?? "w-fit"
      )}
    >
      {text}
    </h1>
  );
}
