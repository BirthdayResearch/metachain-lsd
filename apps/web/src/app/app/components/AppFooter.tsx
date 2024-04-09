import MarbleFiLogo from "@/components/MarbleFiLogo";
import { Tag } from "@/components/Tag";
import clsx from "clsx";
import { FaReddit } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";

const footerLinks = [
  {
    title: "FAQs",
    link: "/faqs",
  },
  {
    title: "Documentation",
    link: "/documentation",
  },
  {
    title: "Terms of Use",
    link: "/terms-of-use",
  },

  {
    title: "Privacy Notice",
    link: "/privacy-notice",
  },
];

export default function AppFooter() {
  return (
    <footer className="mt-10 max-w-5xl px-5 min-w-fit w-full bottom-0 grid gap-y-5">
      <section className="flex flex-row items-center w-full justify-between">
        <div className="flex flex-row items-center md:w-full">
          <MarbleFiLogo customStyle="w-[101px] h-[23px] md:w-fit sm:h-auto" />

          <div className="md:block hidden">
            <FooterNaviationLinkWeb />
          </div>
        </div>
        <div className="ml-2 w-full md:w-fit md:justify-end">
          <Tag
            text="v1.21"
            testID="footer-version-tag"
            customStyle="bg-light-1000/[0.05] px-3 !py-1 mr-2 w-fit"
          />
        </div>
        <div className="flex flex-row items-center gap-x-2">
          <FaReddit size={24} className="text-light-1000/50" />
          <FaXTwitter size={24} className="text-light-1000/50" />
        </div>
      </section>

      {/*  Mobile view */}
      <div className="block md:hidden">
        <FooterNaviationLinkMobile />
      </div>
    </footer>
  );
}

function FooterNaviationLinkWeb() {
  return (
    <div className="flex flex-row divide-light-1000/10 ml-6 w-full">
      {footerLinks.map((link, index) => (
        <div key={link.title} className="flex flex-row items-center">
          <a
            href={link.link}
            className={clsx(
              "text-light-1000/50 font-mono text-sm px-3 text-center border-light-1000/10",
              { "border-r": index !== footerLinks.length - 1 },
            )}
          >
            {link.title}
          </a>
        </div>
      ))}
    </div>
  );
}
function FooterNaviationLinkMobile() {
  return (
    <div className="flex flex-col">
      {footerLinks.map((link, index) => (
        <Link
          key={link.title}
          className={clsx(
            "border-b py-2 border-light-1000/10 text-light-1000/50 active:text-opacity-10 text-xs cursor-pointer",
            { "pt-0": index === 0 },
            { "pb-0 border-b-0": index === footerLinks.length - 1 },
          )}
          href={link.link}
        >
          <span className="py-1">{link.title}</span>
        </Link>
      ))}
    </div>
  );
}
