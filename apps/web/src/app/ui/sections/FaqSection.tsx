import { CardDesc } from "@/app/ui/components/CardDesc";
import SectionContainer from "@/app/ui/components/SectionContainer";
import { CardTitle } from "@/app/ui/components/CardTitle";
import { Disclosure, Transition } from "@headlessui/react";
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
      <div className="w-full flex flex-col md:flex-row gap-y-8 md:gap-y-0 md:gap-x-10">
        <div className="flex flex-col gap-y-3 w-full md:gap-y-6 md:w-1/2 text-left">
          <Tag text="ECOSYSTEM" testID="faq-ecosystem" />
          <div className="flex flex-col gap-y-5">
            <CardTitle 
              text="Frequently asked questions" 
              testID="faq-title" 
              customStyle="text-start text-2xl"
            />
            <CardDesc
              customStyle="!text-left !font-normal"
              text="Learn more about the protocol with these frequently asked questions. Get to know what would be its value and how it can help you grow your investments."
              testID="faq-desc"
            />
          </div>
        </div>
        <div className="w-full flex flex-col md:w-1/2 w-full gap-y-4">
          {FaqItems.map((item) => (
            <Disclosure key={item.testId}>
              {({ open }) => (
                <div className="px-7 py-[18px] bg-light-00/30 rounded-md" data-testid={item.testId}>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg text-left text-sm">
                    <span
                      className={`mr-6 flex-1 self-center ${open ? "font-semibold" : "font-normal"}`}
                    >
                      {item.title}
                    </span>
                    <FiChevronDown
                      className={`transition duration-300 ease-in ${
                        open ? "rotate-180 transform" : ""
                      } h-7 w-7`}
                    />
                  </Disclosure.Button>
                  <Transition
                    as="div"
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Disclosure.Panel className="mt-3 mr-[52px] text-sm">
                      {item.desc}
                    </Disclosure.Panel>
                  </Transition>
                </div>
              )}
            </Disclosure>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
