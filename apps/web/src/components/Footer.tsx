import SectionContainer from "@/components/SectionContainer";
import MarbleFiLogo from "@/components/MarbleFiLogo";
import NavigationBar from "@/components/navigation/NavigationBar";
import { RefObject } from "react";
// import Image from "next/image";

export default function Footer({
  parentReference,
}: {
  parentReference: RefObject<HTMLDivElement>;
}) {
  return (
    <SectionContainer customContainerStyle="flex-col pt-[120px] pb-[68px]">
      <footer
        data-testid="footer"
        className="flex items-center justify-center flex-col gap-y-6"
      >
        <MarbleFiLogo />
        <NavigationBar isHeader={false} parentReference={parentReference} />

        {/* <div className="flex gap-x-1 text-xs">
          <span className="text-xs">Terms of service</span>
          <span className={`${inter.className} text-light-1000/30`}>|</span>
          <span>Privacy Policy</span>
        </div>
        <figure className="flex flex-row gap-x-5">
          <Image
            data-testid="footer-reddit-icon"
            src="/assets/icons/reddit.svg"
            alt="Reddit Icon"
            width={24}
            height={24}
          />
          <Image
            data-testid="footer-x-icon"
            src="/assets/icons/x.svg"
            alt="X Icon"
            width={24}
            height={24}
          />
        </figure> */}
      </footer>
    </SectionContainer>
  );
}
