import clsx from "clsx";
import React from "react";

export default function WalletDetails({
  isWalletConnected,
  style,
}: {
  isWalletConnected: boolean;
  style?: string;
}) {
  return (
    <div
      data-testid="wallet-connection"
      className={clsx("flex items-center", style)}
    >
      {isWalletConnected ? (
        <p>
          <span className="opacity-40">Available: </span>
          <span className="font-semibold opacity-70">walletAmount</span>
        </p>
      ) : (
        <span className="text-xs text-warning font-semibold">
          Connect wallet to get started
        </span>
      )}
    </div>
  );
}
