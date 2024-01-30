import Image from "next/image";
export default function HeaderLogo() {
  return (
    <Image
      data-testid="header-marblefi-logo"
      src="/header-logo.svg"
      alt="MarbleFi Logo"
      width={170}
      height={40}
    />
  );
}
