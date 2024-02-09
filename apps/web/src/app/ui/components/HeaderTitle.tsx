import Image from "next/image";
import Link from "next/link";
export default function HeaderLogo({ isHeader = true }: { isHeader: boolean }) {
  return (
    <Link href="/">
      <Image
        data-testid="header-marblefi-logo"
        src="/header-logo.svg"
        alt="MarbleFi Logo"
        width={170}
        height={40}
        className={
          isHeader ? "w-[132px] h-[30px] md:w-[170px] md:h-[40px]" : ""
        }
      />
    </Link>
  );
}
