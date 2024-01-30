import Image from "next/image";
import Link from "next/link";
export default function HeaderLogo() {
  return (
    <Link href="/">
      <Image
        data-testid="header-marblefi-logo"
        src="/header-logo.svg"
        alt="MarbleFi Logo"
        width={170}
        height={40}
      />
    </Link>
  );
}
