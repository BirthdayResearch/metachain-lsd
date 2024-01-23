const navigationTabs = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Benefits", href: "/benefits" },
  { label: "About mDFI", href: "/about" },
  { label: "Community", href: "/community" },
  { label: "FAQs", href: "/faqs" },
];

export default function NavigationBar() {
  return (
    <div className="navigation-outline flex py-1.5 px-5 justify-center items-center gap-1">
      {navigationTabs.map((link) => {
        return (
          <a
            key={link.label}
            href={link.href}
            className="flex h-[48px] grow items-center justify-center text-sm hover:bg-sky-100 text-light-00 hover:text-blue-600 p-2.5 px-4"
          >
            <p className="text-sm">{link.label}</p>
          </a>
        );
      })}
    </div>
  );
}
