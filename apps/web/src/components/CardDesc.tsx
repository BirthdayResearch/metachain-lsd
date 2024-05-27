import clsx from "clsx";
export function CardDesc({
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
      data-testid={`card-desc-${testId}`}
      className={clsx("text-xl text-center font-light", customStyle ?? "w-fit")}
    >
      {text}
    </h1>
  );
}
