import "../globals.css";

import { useState, RefObject } from "react";
import clsx from "clsx";
import NavigationBarMobile from "@/components/NavigationBarMobile";
import MarbleFiLogo from "@/components/MarbleFiLogo";
import { usePathname } from "next/navigation";
import MainHeader from "@/components/header/MainHeader";
import AppHeader from "@/components/header/AppHeader";
import AppNavigationBarMobile from "@/components/AppNavigationBarMobile";

export default function Header({
  parentReference,
}: {
  parentReference: RefObject<HTMLDivElement>;
}) {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);

  const handleOnClick = () => {
    setIsActive(!isActive);
  };

  return (
    <>
      <div
        className={clsx(
          {
            hidden: isActive,
          },
          "sticky z-50 py-5 lg:flex top-0 header-bg md:py-10 w-full flex items-center justify-center font-mono text-sm mb-8 md:mb-16",
        )}
      >
        <div className="flex w-full items-center px-5 min-w-fit max-w-5xl justify-between md:pt-0 pt-2">
          <MarbleFiLogo customStyle="md:w-full w-[132px] h-[30px] sm:h-auto" />
          <>
            {pathname === "/" ? (
              <MainHeader
                handleOnClick={handleOnClick}
                parentReference={parentReference}
                isActive={isActive}
                setIsActive={setIsActive}
              />
            ) : (
              <AppHeader
                handleOnClick={handleOnClick}
                isActive={isActive}
                setIsActive={setIsActive}
              />
            )}
          </>
        </div>
      </div>
      {isActive && (
        <div className="relative">
          {pathname === "/" ? (
            <NavigationBarMobile
              onClose={handleOnClick}
              parentReference={parentReference}
            />
          ) : (
            <AppNavigationBarMobile onClose={handleOnClick} />
          )}
        </div>
      )}
    </>
  );
}
