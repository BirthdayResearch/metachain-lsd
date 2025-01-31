import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
export default function MarbleFiLogo({
  customStyle,
  testId,
}: {
  customStyle?: string;
  testId: string;
}) {
  return (
    <Link href="/">
      <Image
        data-testid={`${testId}-marblefi-logo`}
        src="/header-logo.svg"
        alt="MarbleFi Logo"
        width={170}
        height={40}
        priority={true}
        className={clsx(customStyle)}
      />
    </Link>
  );
}
