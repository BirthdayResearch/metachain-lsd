import { MdMenu } from "react-icons/md";

import { RefObject } from "react";
import NavigationBar from "@/components/navigation/NavigationBar";
import { CTAButton } from "@/components/button/CTAButton";

export default function MainHeader({
  parentReference,
  handleOnClick,
  isActive,
}: {
  handleOnClick: () => void;
  parentReference: RefObject<HTMLDivElement>;
  isActive: boolean;
  setIsActive: (value: boolean) => void;
}) {
  return (
    <>
      {/* Mobile Header View */}
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
      {/* Mobile Header View */}

      <NavigationBar isHeader parentReference={parentReference} />

      <div className="items-end justify-center md:flex hidden">
        <CTAButton
          navigateTo="/app/stake"
          label="Launch app"
          testID="header-launch-app"
          customStyle="w-full md:w-fit"
        />
      </div>
    </>
  );
}
