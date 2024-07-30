import clsx from "clsx";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppNavigation } from "@/lib/types";

export const appNavigationTabs: AppNavigation[] = [
  { label: "Stake", href: "/stake" },
  { label: "Withdraw", href: "/withdraw" },
  // { label: "Pool", href: "/pool" },
];

export default function AppNavigationBarWeb() {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState("/stake");

  useEffect(() => {
    setIsActive(pathname);
  }, [pathname]);

  return (
    <nav
      data-testid="header-navigation-bar-web"
      className="hidden md:flex py-1.5 px-5 justify-center items-center gap-x-1"
    >
      <ul className="flex h-[48px] items-center justify-center">
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
