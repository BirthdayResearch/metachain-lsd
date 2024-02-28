import { CardDesc } from "@/app/ui/components/CardDesc";
import SectionContainer from "@/app/ui/components/SectionContainer";
import { CardTitle } from "@/app/ui/components/CardTitle";
import { Disclosure } from "@headlessui/react";
import { FiChevronDown } from "react-icons/fi";
import { Tag } from "@/app/ui/components/Tag";

const FaqItems = [
  {
    testId: "what-is-liquid-staking",
    title: "What is liquid staking?",
    desc: "Native coins of a PoS chain are deposited with a staking service provider (In our case it is the Masternode Validator) MarbleFi then issues a 'receipt' in the form of a liquid synthetic token which is inherently interest-bearing.",
  },
  {
    testId: "how-much-earn-stake",
    title: "How much can I earn if I stake?",
    desc: "This is a just a sample content. The content and copy within this is to be discussed.",
  },
  {
    testId: "how-to-use-marble",
    title: "How do I use Marble?",
    desc: "This is a just a sample content. The content and copy within this is to be discussed.",
  },
  {
    testId: "how-long-to-wait",
    title: "How long do I have to wait to withdraw any of my staked tokens?",
    desc: "This is a just a sample content. The content and copy within this is to be discussed.",
  },
];

export default function FaqSection() {
  return (
    <SectionContainer>
      <div className="w-full flex flex-col md:flex-row md:gap-x-10 gap-y-12 ">
        <div className="flex flex-col gap-y-6 max-w-[528px] text-left">
          <Tag text="ECOSYSTEM" testID="faq-ecosystem" />
          <div className="flex flex-col gap-y-5">
            <CardTitle text="Frequently asked questions" testID="faq-title" />
            <CardDesc
              customStyle="!text-left"
              text="Learn more about the protocol with these frequently asked questions. Get to know what would be its value and how it can help you grow your investments."
              testID="faq-desc"
            />
          </div>
        </div>
        <div className="w-full">
          {FaqItems.map((item) => (
            <Disclosure key={item.testId}>
              {({ open }) => (
                <div className="px-7 py-[18px]" data-testid={item.testId}>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg text-left text-sm">
                    <span
                      className={`${open ? "font-semibold" : "font-normal"}`}
                    >
                      {item.title}
                    </span>
                    <FiChevronDown
                      className={`${
                        open ? "rotate-180 transform" : ""
                      } h-5 w-5`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="mt-3 mr-20">
                    {item.desc}
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
