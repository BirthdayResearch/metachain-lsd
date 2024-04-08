import { useState } from "react";
import clsx from "clsx";
import MarbleFiLogo from "@/components/MarbleFiLogo";
import AppNavigationBarMobile from "@/app/app/components/AppNavigationBarMobile";
import AppNavigationBarWeb from "@/app/app/components/AppNavigationBarWeb";
import ConnectButton from "@/components/button/WalletConnect";
import { MdMenu } from "react-icons/md";

export default function AppHeader() {
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
          "sticky z-50 py-5 lg:flex top-0 header-bg md:py-10 w-full flex items-center justify-center font-mono text-sm mb-8 md:mb-10",
        )}
      >
        <div className="flex w-full items-center px-5 min-w-fit max-w-5xl justify-between md:pt-0 pt-2">
          <MarbleFiLogo customStyle="md:w-full w-[132px] h-[30px] sm:h-auto" />
          <AppNavigationBarWeb isHeader={true} />
          <div className="items-end justify-center md:flex hidden">
            <ConnectButton />
          </div>

          {/* Mobile Header View */}
          <div className="md:hidden flex flex-row gap-x-2">
            <div className="sm:block hidden">
              <ConnectButton />
            </div>
            {!isActive && (
              <button
                onClick={handleOnClick}
                className="md:hidden flex text-light-1000 py-1.5 375 justify-center items-center"
              >
                <MdMenu size={28} />
              </button>
            )}
          </div>
          {/* Mobile Header View */}
        </div>
      </div>

      {isActive && (
        <div className="relative">
          <AppNavigationBarMobile onClose={handleOnClick} />
        </div>
      )}
    </>
  );
}
