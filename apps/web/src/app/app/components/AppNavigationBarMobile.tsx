import { IoMdClose } from "react-icons/io";
import MarbleFiLogo from "../../../components/MarbleFiLogo";

import Link from "next/link";
import ConnectButton from "@/components/button/WalletConnect";
import { appNavigationTabs } from "@/app/app/components/AppNavigationBarWeb";

export default function AppNavigationBarMobile({ onClose }: { onClose: any }) {
  return (
    <div
      className="w-full fixed top-0 right-0 bg-light-00 min-h-screen z-10"
      style={{
        backgroundImage: "url('/header-bg-logo.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex items-center md:px-12 px-5 py-8 min-w-fit max-w-5xl justify-between">
        <MarbleFiLogo customStyle="md:w-full w-[132px] h-[30px] sm:h-auto" />
        <IoMdClose
          size={30}
          onClick={onClose}
          className="opacity-70 text-dark-00 cursor-pointer"
        />
      </div>
      <nav data-testid="header-app-navigation-bar-mobile">
        <ul className="flex flex-col">
          <div className="mt-5 md:mx-12 mx-5">
            <ConnectButton />
          </div>
          {appNavigationTabs.map((link) => (
            <Link
              key={link.label}
              className="md:mx-12 mx-5 py-7 lg:py-3 border-b border-light-1000/10 font-bold text-light-1000 active:text-opacity-10 text-sm cursor-pointer"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </ul>
      </nav>
    </div>
  );
}
