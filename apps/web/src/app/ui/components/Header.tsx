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
    <div className="max-w-5xl min-w-fit w-full flex lg:items-center justify-between font-mono text-sm md:mb-8">
      <HeaderLogo />

      {/*  Web */}
      <NavigationBar />
      <div className="items-end justify-center lg:flex hidden">
        <ConnectButton />
      </div>
      {/*  Web  */}

      {/* Mobile */}
      {isMenuActive ? (
        <NavigationBarMobile
          onClick={() => {
            setisMenuActive(true);
          }}
        />
      ) : (
        //     Open Menu
        <div />
      )}
      {/* Mobile */}
    </div>
  );
}
