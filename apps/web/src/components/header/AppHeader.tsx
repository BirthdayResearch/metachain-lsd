import { MdMenu } from "react-icons/md";
import { CTAButton } from "@/components/button/CTAButton";
import AppNavigationBar from "@/components/AppNavigationBar";

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
      <div className="md:hidden block">
        {!isActive && (
          <button
            onClick={handleOnClick}
            className="md:hidden flex text-light-1000 py-1.5 375 justify-center items-center"
          >
            <MdMenu size={28} />
          </button>
        )}
      </div>
      {/* End of Mobile Header View */}

      <AppNavigationBar isHeader />

      <div className="items-end justify-center md:flex hidden">
        <CTAButton
          label="Connect wallet"
          testID="connect-wallet"
          customStyle="w-full md:w-fit"
        />
      </div>
    </>
  );
}
