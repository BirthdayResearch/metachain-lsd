import clsx from "clsx";

export default function WalletDetails({
  walletAmount,
  isWalletConnected,
  style,
}: {
  walletAmount: string;
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
          <span className="font-normal text-light-1000/50 text-xs">
            Available:{" "}
          </span>
          <span className="font-semibold text-xs opacity-70">
            {walletAmount} DFI
          </span>
        </p>
      ) : (
        <span className="text-xs text-warning font-semibold">
          Connect wallet to get started
        </span>
      )}
    </div>
  );
}
