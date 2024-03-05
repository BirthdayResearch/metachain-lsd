"use client";

import "../../globals.css";

import NavigationBar from "@/app/ui/components/NavigationBar";
import { useState, RefObject } from "react";
import NavigationBarMobile from "@/app/ui/components/NavigationBarMobile";
// import { useState } from "react";
// import NavigationBarMobile from "@/app/ui/components/NavigationBarMobile";
import HeaderLogo from "@/app/ui/components/HeaderTitle";
import { CTAButton } from "@/app/ui/components/CTAButton";

export default function Header({
  parentReference,
}: {
  parentReference: RefObject<HTMLDivElement>;
}) {
  const [isMenuActive, setisMenuActive] = useState(false);
  return (
    <div className="sticky z-50 top-8 md:top-0 header-bg md:py-10 w-full flex items-center justify-center font-mono text-sm mb-8 md:mb-16">
      <header className="flex w-full items-center min-w-fit max-w-5xl justify-between">
        <HeaderLogo isHeader />

        {/*  Web */}
        <NavigationBar isHeader parentReference={parentReference} />
        <div className="items-end justify-center md:flex hidden">
          <CTAButton
            text="Launch app"
            testID="launch-app"
            customStyle="w-full md:w-fit"
          />
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
      </header>
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
