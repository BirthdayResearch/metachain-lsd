import clsx from "clsx";
import { useAccount } from "wagmi";
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
        `accent-1 rounded-[30px] relative flex items-center justify-center w-full
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
        `flex flex-row items-center justify-center rounded-[20px] border-[1.5px]
          border-dark-card-stroke py-2 px-2 pl-3`,
      )}
    >
      <div className="flex items-center">
        <MetaMaskIcon />
        <div className="ml-2 text-left">
          <span className="block text-sm text-light-1000">{walletText}</span>
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
  const { chain } = useAccount();
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
