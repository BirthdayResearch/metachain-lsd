import clsx from "clsx";
import Link from "next/link";
import Spinner from "../../components/Spinner";

export function CTAButton({
  label,
  testId,
  customStyle,
  customTextStyle,
  customBgColor,
  onClick,
  isDisabled,
  isLoading = false,
  navigateTo = "",
  children,
}: {
  label: string;
  testId: string;
  isDisabled?: boolean;
  onClick?: (e: any) => void;
  customStyle?: string;
  customTextStyle?: string;
  customBgColor?: string;
  isLoading?: boolean;
  navigateTo?: string;
  children?: JSX.Element;
}) {
  const Button = (
    <button
      disabled={isDisabled}
      onClick={onClick}
      data-testid={`cta-button-${testId}`}
      className={clsx(
        "rounded-[30px] px-9 py-5 md:py-4",
        customBgColor ?? "accent-1",
        !isDisabled && "hover:bg-opacity-60",
        isDisabled ? "opacity-30" : "",
        customStyle ?? "w-fit",
      )}
    >
      <div className="items-center justify-center flex flex-row gap-x-2">
        {children}
        <span
          className={clsx(
            customTextStyle ??
              "active:text-opacity-60 text-sm font-bold text-light-1000",
          )}
        >
          {label}
        </span>
        {isLoading ? <Spinner className="animate-spin w-5 h-5" /> : null}
      </div>
    </button>
  );
  const isTestEnv = process.env.NODE_ENV === "test";
  return navigateTo ? (
    <Link
      href={navigateTo}
      rel={isTestEnv ? undefined : "noopener noreferrer"}
      target={isTestEnv ? undefined : "_blank"}
    >
      {Button}
    </Link>
  ) : (
    Button
  );
}
