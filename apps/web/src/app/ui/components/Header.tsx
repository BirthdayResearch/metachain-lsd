import "../../globals.css";

import { useState, RefObject } from "react";
import { MdMenu } from "react-icons/md";
import clsx from "clsx";
import NavigationBar from "@/app/ui/components/NavigationBar";
import NavigationBarMobile from "@/app/ui/components/NavigationBarMobile";
import MarbleFiLogo from "@/app/ui/components/MarbleFiLogo";
import { CTAButton } from "@/app/ui/components/CTAButton";

export default function Header({
  parentReference,
}: {
  parentReference: RefObject<HTMLDivElement>;
}) {
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
        <div className="flex w-full items-center px-5 min-w-fit max-w-5xl justify-between">
          <MarbleFiLogo customStyle="w-full h-[30px] sm:h-auto" />

          {/* Mobile Header View */}
          <div className="md:hidden block">
            {!isActive && (
              <button
                onClick={handleOnClick}
                className="md:hidden flex text-light-1000 py-1.5 375 justify-center items-center"
              >
                <MdMenu size={28} />
              </button>
            )}
          </div>
          {/* End of Mobile Header View */}

          <NavigationBar isHeader parentReference={parentReference} />

          <div className="items-end justify-center md:flex hidden">
            <CTAButton
              text="Launch app"
              testID="launch-app"
              customStyle="w-full md:w-fit"
            />
          </div>
        </div>
      </div>
      {isActive && (
        <>
          <NavigationBarMobile
            onClose={handleOnClick}
            parentReference={parentReference}
          />
        </>
      )}
    </>
  );
}
