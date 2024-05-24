import clsx from "clsx";
import Link from "next/link";

export function SecondaryButton({
  onClick,
  text,
  testId,
  customStyle,
  customTextStyle = "text-light-00",
  href,
}: {
  onClick?: () => void;
  text: string;
  testId: string;
  customStyle?: string;
  customTextStyle?: string;
  href?: string;
}) {
  const Button = (
    <button
      data-testid={`secondary-button-${testId}`}
      className={clsx(
        "border border-light-1000 rounded-[30px] px-9 py-5 md:py-4",
        "border-light-1000 hover:border-brand-100 active:text-opacity-60",
        "text-sm font-bold text-light-1000",
        customTextStyle,
        customStyle ?? "w-fit",
      )}
      onClick={onClick}
    >
      {text}
    </button>
  );

  return href ? (
    <Link href={href} rel="noopener noreferrer" target="_blank">
      {Button}
    </Link>
  ) : (
    Button
  );
}
