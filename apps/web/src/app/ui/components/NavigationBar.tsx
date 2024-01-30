const navigationTabs = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Benefits", href: "/benefits" },
  { label: "About mDFI", href: "/about" },
  { label: "Community", href: "/community" },
  { label: "FAQs", href: "/faqs" },
];

export default function NavigationBar() {
  return (
    <div
      data-testid="header-navigation-bar-web"
      className="navigation-header-ui py-1.5 px-5 justify-center items-center gap-x-1 hidden lg:flex"
    >
      {navigationTabs.map((link) => {
        return (
          <a
            key={link.label}
            href={link.href}
            className="flex h-[48px] grow items-center justify-center text-sm text-light-00 p-2.5 px-4"
          >
            <p className="text-sm text-light-1000 font-bold	active:text-opacity-10">
              {link.label}
            </p>
          </a>
        );
      })}
    </div>
  );
}
