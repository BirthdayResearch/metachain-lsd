import clsx from "clsx";
import { useNetwork } from "wagmi";
import { ConnectKitButton } from "connectkit";
import MetaMaskIcon from "@/app/landing-page/components/MetaMaskIcon";
import { ETHEREUM_MAINNET_ID } from "@/lib/constants";
import truncateTextFromMiddle from "@/lib/textHelper";
import useResponsive from "@/hooks/useResponsive";

function PreConnectedButton({
  onClick,
}: {
  onClick: (() => void) | undefined;
}): JSX.Element {
  const btnLabel = "Connect Wallet";
  return (
    <button
      data-testid="connect-button"
      type="button"
      className={clsx(
        `accent-1 rounded-[30px] relative flex items-center justify-center max-w-full
         px-9 py-4`,
      )}
      onClick={onClick}
    >
      <span className="text-sm font-bold text-light-1000 active:text-opacity-60">
        {btnLabel}
      </span>
    </button>
  );
}

function ConnectedButton({
  address,
  chain,
  onClick,
}: {
  address: string;
  chain: string;
  onClick: (() => void) | undefined;
}): JSX.Element {
  const { isLg } = useResponsive();
  const walletText = truncateTextFromMiddle(address, isLg ? 5 : 4);
  return (
    <button
      data-testid="wallet-button"
      type="button"
      onClick={onClick}
      className={clsx(
        `flex h-8 items-center rounded-[10px] border-[1.5px] w-full
          border-dark-card-stroke pl-4 pr-3 py-3 md:h-[52px] lg:h-12 md:pl-2.5 md:pr-7 lg:py-1.5`,
      )}
    >
      <div className="flex items-center">
        <MetaMaskIcon />
        <div className="ml-2 text-left">
          <span className="block text-sm text-dark-1000">{walletText}</span>
          <div className="flex items-center">
            <span className="text-xs text-dark-700">{chain}</span>
            <div className="ml-1 h-2 w-2 rounded-full bg-valid" />
          </div>
        </div>
      </div>
    </button>
  );
}

export default function ConnectButton() {
  const { chain } = useNetwork();
  const displayedChainName =
    chain?.id === ETHEREUM_MAINNET_ID ? "Ethereum MainNet" : chain?.name;

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, address, show }) =>
        isConnected ? (
          <ConnectedButton
            address={address as string}
            chain={displayedChainName as string}
            onClick={show}
          />
        ) : (
          <PreConnectedButton onClick={show} />
        )
      }
    </ConnectKitButton.Custom>
  );
}
