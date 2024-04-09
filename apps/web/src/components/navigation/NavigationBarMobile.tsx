import { useEffect, useState, RefObject } from "react";
import { IoMdClose } from "react-icons/io";
import MarbleFiLogo from "../MarbleFiLogo";

import { navigationTabs } from "./NavigationBar";

export default function NavigationBarMobile({
  onClose,
  parentReference,
}: {
  onClose: any;
  parentReference: RefObject<HTMLDivElement>;
}) {
  const [parentRef, setParentRef] = useState<HTMLDivElement>();

  useEffect(() => {
    if (parentReference?.current) {
      setParentRef(parentReference.current);
    }
  }, [parentReference]); // Empty dependency array ensures the effect runs only once after initial render

  return (
    <div
      className="w-full fixed top-0 right-0 bg-light-00 min-h-screen z-10"
      style={{
        backgroundImage: "url('/header-bg-logos.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex items-center md:px-12 px-5 py-8 min-w-fit max-w-5xl justify-between">
        <MarbleFiLogo customStyle="md:w-full w-[132px] h-[30px] sm:h-auto" />
        <IoMdClose
          size={30}
          onClick={onClose}
          className="opacity-70 text-dark-00 cursor-pointer"
        />
      </div>
      <nav data-testid="header-navigation-bar-mobile">
        <ul className="pt-5">
          {navigationTabs.map((link) => (
            <li
              key={link.label}
              className="py-7 md:mx-12 mx-5 lg:py-3 border-b border-light-1000/10 font-semibold text-light-1000 active:text-opacity-10 text-sm cursor-pointer"
              onClick={() => {
                if (parentRef) {
                  const targetElement = parentRef.querySelector(`${link.href}`);
                  if (targetElement) {
                    targetElement.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }
                  onClose();
                }
              }}
            >
              {link.label}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
