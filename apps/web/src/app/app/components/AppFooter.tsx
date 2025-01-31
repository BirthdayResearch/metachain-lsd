import MarbleFiLogo from "@/components/MarbleFiLogo";
import { Tag } from "@/components/Tag";
import clsx from "clsx";
import { FaReddit } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";
import { useGetVersionMutation } from "@/store/marbleFiApi";
import { useEffect, useState } from "react";

const footerLinks = [
  // {
  //   title: "FAQs",
  //   link: "/faqs",
  // },
  {
    title: "Documentation",
    link: "https://marblefi.gitbook.io/marblefi-documentation",
    tewTab: true,
  },
  {
    title: "Terms of Use",
    link: "https://marblefi.gitbook.io/marblefi-documentation/legal/terms-and-conditions",
    tewTab: true,
  },
  // {
  //   title: "Privacy Notice",
  //   link: "/privacy-notice",
  // },
];

export default function AppFooter() {
  const [version, setVersion] = useState("0.0.0");
  const [getVersion] = useGetVersionMutation();

  const fetchVersion = async () => {
    const ver = await getVersion({}).unwrap();
    setVersion(ver?.v);
  };

  useEffect(() => {
    fetchVersion();
  }, []);

  return (
    <footer className="py-10 md:py-0 max-w-5xl px-5 min-w-fit w-full bottom-0 grid gap-y-5">
      <section className="flex flex-row items-center w-full justify-between md:py-10 md:border-t md:border-light-1000/10">
        <div className="flex flex-row items-center md:w-full">
          <MarbleFiLogo customStyle="w-[101px] h-[23px]" testId="app-footer" />

          <div className="md:block hidden">
            <FooterNaviationLinkWeb />
          </div>
        </div>
        <div className="ml-2 w-full md:w-fit md:justify-end">
          <Tag
            text={`V${version}`}
            testId="footer-version-tag"
            customStyle="bg-light-1000/[0.05] px-3 !py-1 mr-2 w-fit"
          />
        </div>
        <div className="flex flex-row items-center gap-x-2">
          <Link
            href="https://www.reddit.com/r/defiblockchain"
            rel="noopener noreferrer"
            target="_blank"
          >
            <FaReddit size={24} className="text-light-1000/50" />
          </Link>
          <Link
            href="https://twitter.com/marblefi_xyz"
            rel="noopener noreferrer"
            target="_blank"
          >
            <FaXTwitter size={24} className="text-light-1000/50" />
          </Link>
        </div>
      </section>

      {/* Mobile view */}
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
          <Link
            href={link.link}
            {...(link.tewTab
              ? { rel: "noopener noreferrer", target: "_blank" }
              : {})}
            className={clsx(
              "text-light-1000/50 font-mono text-xs px-3 text-center border-light-1000/10",
              { "border-r": index !== footerLinks.length - 1 },
            )}
          >
            {link.title}
          </Link>
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
          {...(link.tewTab
            ? { rel: "noopener noreferrer", target: "_blank" }
            : {})}
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
