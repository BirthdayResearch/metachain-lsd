import clsx from "clsx";

const navigationTabs = [
  { label: "Benefits", href: "#benefits-section" },
  { label: "How it works", href: "#how-it-works-section" },
  { label: "About mDFI", href: "#about-section" },
  { label: "Community", href: "#community-section" },
  { label: "FAQs", href: "#faqs-section" },
];

export default function NavigationBar({
  isHeader = true,
}: {
  isHeader: boolean;
}) {
  const headerStyle =
    "border border-light-00/10 backdrop-opacity-50 bg-light-00/10 rounded-[40px] hidden lg:flex";
  const hoverStyle = isHeader ? "hover:bg-light-00/10" : "";

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
        <a
          key={link.label}
          href={link.href}
          className={clsx(
            "flex h-[48px] items-center justify-center text-sm text-light-00 p-2.5 px-4 rounded-[30px]",
            hoverStyle,
          )}
        >
          <p className="text-sm text-light-1000 font-bold active:text-opacity-10">
            {link.label}
          </p>
        </a>
      ))}
    </nav>
  );
}
