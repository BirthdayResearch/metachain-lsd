"use client";

import "../../globals.css";

import NavigationBar from "@/app/ui/components/NavigationBar";
// import { useState } from "react";
// import NavigationBarMobile from "@/app/ui/components/NavigationBarMobile";
import HeaderLogo from "@/app/ui/components/HeaderTitle";
import { CTAButton } from "@/app/ui/components/CTAButton";

export default function Header() {
  // const [isMenuActive, setisMenuActive] = useState(false);
  return (
    <div className="max-w-5xl min-w-fit w-full flex items-center justify-between font-mono text-sm mb-8 md:mb-16">
      <HeaderLogo />

      {/*  Web */}
      <NavigationBar />
      <div className="items-end justify-center md:flex hidden">
        <CTAButton
          text="Launch app"
          testID="launch-app"
          customStyle="w-full md:w-fit"
        />
      </div>
      {/*  Web  */}

      {/* Mobile */}
      {/*{isMenuActive ? (*/}
      {/*  //     Open Menu*/}
      {/*  <div />*/}
      {/*) : (*/}
      {/*  <NavigationBarMobile*/}
      {/*    onClick={() => {*/}
      {/*      setisMenuActive(true);*/}
      {/*    }}*/}
      {/*  />*/}
      {/*)}*/}
      {/* Mobile */}
    </div>
  );
}
