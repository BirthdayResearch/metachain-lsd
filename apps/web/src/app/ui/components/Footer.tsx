import SectionContainer from "@/app/ui/components/SectionContainer";
import HeaderLogo from "@/app/ui/components/HeaderTitle";
import NavigationBar from "@/app/ui/components/NavigationBar";
// import Image from "next/image";

export default function Footer() {
  return (
    <SectionContainer customContainerStyle="flex-col pt-[120px] pb-[68px]">
      <footer
        data-testid="footer"
        className="flex items-center justify-center flex-col gap-y-6"
      >
        <HeaderLogo isHeader={false} />
        <NavigationBar isHeader={false} />
        {/*<div className="flex gap-x-1 text-xs">*/}
        {/*  <span className="text-xs">Terms of service</span>*/}
        {/*  <span className={`${inter.className} text-light-1000/30`}>|</span>*/}
        {/*  <span>Privacy Policy</span>*/}
        {/*</div>*/}
        {/*<figure className="flex flex-row gap-x-5">*/}
        {/*  <Image*/}
        {/*    data-testid="footer-reddit-icon"*/}
        {/*    src="/assets/icons/reddit.svg"*/}
        {/*    alt="Reddit Icon"*/}
        {/*    width={24}*/}
        {/*    height={24}*/}
        {/*  />*/}
        {/*  <Image*/}
        {/*    data-testid="footer-x-icon"*/}
        {/*    src="/assets/icons/x.svg"*/}
        {/*    alt="X Icon"*/}
        {/*    width={24}*/}
        {/*    height={24}*/}
        {/*  />*/}
        {/*</figure>*/}
      </footer>
    </SectionContainer>
  );
}
