import clsx from "clsx";
export function SectionDescription({
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
        "text-[28px] text-center leading-[44px] -tracking-[1.92] font-light",
        customStyle ?? "w-fit",
      )}
    >
      {text}
    </h1>
  );
}
