import { MdMenu } from "react-icons/md";
import NavigationBar from "@/app/ui/components/navigation/NavigationBar";
import { CTAButton } from "@/app/ui/components/button/CTAButton";
import { RefObject } from "react";

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

      <NavigationBar isHeader parentReference={parentReference} />

      <div className="items-end justify-center md:flex hidden">
        <CTAButton
          navigateTo="/stake"
          label="Launch app"
          testID="launch-app"
          customStyle="w-full md:w-fit"
        />
      </div>
    </>
  );
}
