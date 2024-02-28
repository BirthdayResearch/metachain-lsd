import clsx from "clsx";
export function CardDesc({
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
      data-testid={`card-desc-${testID}`}
      className={clsx("text-xl text-center font-light", customStyle ?? "w-fit")}
    >
      {text}
    </h1>
  );
}
