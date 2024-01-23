"use client";

import "../../globals.css";

import ConnectButton from "@/app/ui/components/WalletConnect";
import NavigationBar from "@/app/ui/components/NavigationBar";
import HeaderTitle from "@/app/ui/components/HeaderTitle";

export default function Header() {
  return (
    <div className="max-w-5xl min-w-fit md:w-full flex items-center justify-between font-mono text-sm md:mb-8">
      <HeaderTitle />
      <NavigationBar />
      <div className="flex items-end justify-center">
        {/*  Or launch app button to refactor to sub layouts */}
        <ConnectButton />
      </div>
    </div>
  );
}
