import { IoMdClose } from "react-icons/io";
import MarbleFiLogo from "./MarbleFiLogo";

import { appNavigationTabs } from "@/components/AppNavigationBar";
import Link from "next/link";

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
        <ul className="pt-5 flex flex-col">
          {appNavigationTabs.map((link) => (
            <Link
              key={link.label}
              className="py-7 md:mx-12 mx-5 lg:py-3 border-b border-light-1000/10 font-bold text-light-1000 active:text-opacity-10 text-sm cursor-pointer"
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
