import clsx from "clsx";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const appNavigationTabs = [
  { label: "Stake", href: "/stake" },
  { label: "Withdraw", href: "/withdraw" },
  { label: "Pool", href: "/pool" },
];

export default function AppNavigationBarWeb({
  isHeader = true,
}: {
  isHeader: boolean;
}) {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState("/stake");

  useEffect(() => {
    setIsActive(pathname);
  }, [pathname]);

  return (
    <nav
      data-testid="header-navigation-bar-web"
      className={clsx(
        {
          "hidden md:flex": isHeader,
          "md:flex": !isHeader,
        },
        "py-1.5 px-5 justify-center items-center gap-x-1",
      )}
    >
      <ul
        className={clsx({
          "flex h-[48px] items-center justify-center": isHeader,
          "flex flex-col md:flex-row text-center": !isHeader,
        })}
      >
        {appNavigationTabs.map((link) => (
          <Link
            key={link.label}
            className={clsx(
              { "font-bold": isActive === `/app${link.href}` },
              "text-sm text-light-1000 py-3 px-4 rounded-[30px] cursor-pointer",
            )}
            href={`/app${link.href}`}
          >
            {link.label}
          </Link>
        ))}
      </ul>
    </nav>
  );
}
