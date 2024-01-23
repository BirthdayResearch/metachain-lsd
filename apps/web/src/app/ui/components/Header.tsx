"use client";

import ConnectButton from "@/app/ui/components/WalletConnect";

export default function Header() {
  return (
    <div className="max-w-5xl w-full flex items-center justify-between font-mono text-sms">
      <p className="flex justify-center pb-6 pt-8">
        <span className="font-mono font-bold">marblefi</span>
      </p>
      <div className="flex items-end justify-center static h-auto w-auto">
        <ConnectButton />
      </div>
    </div>
  );
}
