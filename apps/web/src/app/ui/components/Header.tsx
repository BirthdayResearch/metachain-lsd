"use client";

import "../../globals.css";

import ConnectButton from "@/app/ui/components/WalletConnect";
import NavigationBar from "@/app/ui/components/NavigationBar";
import { useState, RefObject } from "react";
import NavigationBarMobile from "@/app/ui/components/NavigationBarMobile";
import HeaderLogo from "@/app/ui/components/HeaderTitle";

export default function Header({
  parentReference,
}: {
  parentReference: RefObject<HTMLDivElement>;
}) {
  const [isMenuActive, setisMenuActive] = useState(false);
  return (
    <div className="sticky z-50 top-8 md:top-0 header-bg md:py-10 w-full flex items-center justify-center font-mono text-sm mb-8 md:mb-16">
      <div className="flex w-full min-w-fit max-w-5xl justify-between">
        <HeaderLogo isHeader />

        {/*  Web */}
        <NavigationBar isHeader parentReference={parentReference} />
        <div className="items-end justify-center md:flex hidden">
          <ConnectButton />
        </div>
        {/*  Web  */}

        {/* Mobile */}
        {isMenuActive ? (
          //     Open Menu
          <div />
        ) : (
          <NavigationBarMobile
            onClick={() => {
              setisMenuActive(true);
            }}
          />
        )}
        {/* Mobile */}
      </div>
    </div>
  );
}
