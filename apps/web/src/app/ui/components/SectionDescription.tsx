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
      data-testid={`section-description-${testID}`}
      className={clsx(
        "text-center text-xl leading-7 md:text-2xl  md:leading-9 font-light text-light-1000",
        customStyle ?? "w-fit",
      )}
    >
      {text}
    </h1>
  );
}
