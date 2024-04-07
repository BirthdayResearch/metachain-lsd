import { MdMenu } from "react-icons/md";
import AppNavigationBar from "@/components/AppNavigationBar";
import ConnectButton from "@/components/WalletConnect";

export default function AppHeader({
  handleOnClick,
  isActive,
}: {
  handleOnClick: () => void;
  isActive: boolean;
  setIsActive: (value: boolean) => void;
}) {
  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden flex flex-row items-center gap-x-2">
        <div className="hidden sm:block">
          <ConnectButton />
        </div>

        {!isActive && (
          <button
            onClick={handleOnClick}
            className="md:hidden flex text-light-1000 py-1.5 375 justify-center items-center"
          >
            <MdMenu size={28} />
          </button>
        )}
      </div>
      {/* Mobile View */}

      <AppNavigationBar isHeader />

      <div className="items-end justify-center md:flex hidden">
        <ConnectButton />
      </div>
    </>
  );
}
