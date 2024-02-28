"use client";

import "../../globals.css";

import ConnectButton from "@/app/ui/components/WalletConnect";
import NavigationBar from "@/app/ui/components/NavigationBar";
import { useState } from "react";
import NavigationBarMobile from "@/app/ui/components/NavigationBarMobile";
import HeaderLogo from "@/app/ui/components/HeaderTitle";

export default function Header() {
  const [isMenuActive, setisMenuActive] = useState(false);
  return (
    <div className="sticky top-12 z-50 max-w-5xl min-w-fit w-full flex items-center justify-between font-mono text-sm mb-8 md:mb-16">
      <HeaderLogo isHeader />

      {/*  Web */}
      <NavigationBar isHeader />
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
  );
}
