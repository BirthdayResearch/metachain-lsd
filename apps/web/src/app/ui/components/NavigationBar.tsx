import clsx from "clsx";
import { RefObject, useEffect, useState } from "react";

const navigationTabs = [
  { label: "Benefits", href: "#benefits-section" },
  { label: "How it works", href: "#how-it-works-section" },
  { label: "About mDFI", href: "#about-section" },
  { label: "Community", href: "#community-section" },
  { label: "FAQs", href: "#faqs-section" },
];

export default function NavigationBar({
  isHeader = true,
  parentReference,
}: {
  isHeader: boolean;
  parentReference: RefObject<HTMLDivElement>;
}) {
  const headerStyle =
    "border border-light-00/10 backdrop-opacity-50 bg-light-00/10 rounded-[40px] hidden lg:flex";
  const hoverStyle = isHeader ? "hover:bg-light-00/10" : "";
  const [parentRef, setParentRef] = useState<HTMLDivElement>();
  useEffect(() => {
    if (parentReference?.current) {
      setParentRef(parentReference.current);
    }
  }, [parentReference]); // Empty dependency array ensures the effect runs only once after initial render

  return (
    <nav
      data-testid="header-navigation-bar-web"
      className={clsx(
        isHeader && headerStyle,
        !isHeader && "md:flex",
        "py-1.5 px-5 justify-center items-center gap-x-1",
      )}
    >
      {navigationTabs.map((link) => (
        <ul
          key={link.label}
          className={clsx(
            "flex h-[48px] items-center justify-center text-sm text-light-00 p-2.5 px-4 rounded-[30px] cursor-pointer",
            hoverStyle,
          )}
          onClick={() => {
            if (parentRef) {
              const targetElement = parentRef.querySelector(`${link.href}`);
              if (targetElement) {
                targetElement.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }
            }
          }}
        >
          <li className="text-sm text-light-1000 font-bold active:text-opacity-10">
            {link.label}
          </li>
        </ul>
      ))}
    </nav>
  );
}
