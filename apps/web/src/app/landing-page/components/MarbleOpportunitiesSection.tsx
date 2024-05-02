import { CardTitle } from "@/components/CardTitle";
import { CardDesc } from "@/components/CardDesc";
import { AiOutlineDollar } from "react-icons/ai";
import {
  HiOutlineSquaresPlus,
  HiArrowsRightLeft,
  HiOutlineShieldCheck,
} from "react-icons/hi2";
import { IconType } from "react-icons";
import SectionContainer from "@/components/SectionContainer";

const OpportunitiesItems = [
  {
    icon: AiOutlineDollar,
    testId: "yield-rewards",
    label: "Yield rewards securely",
    desc: "You are rewarded not by the token amounts but in the increasing value your tokens will have.",
  },
  {
    icon: HiOutlineSquaresPlus,
    testId: "own-node",
    label: "Just like your own node",
    desc: "Earn rewards from DeFiChain masternodes without breaking any sweat – nice and easy.",
  },
  {
    icon: HiArrowsRightLeft,
    testId: "easy-reliable-exit",
    label: "Easy and reliable exit",
    desc: "Have the flexibility to exit your position if your investment thesis changes.",
  },
  {
    icon: HiOutlineShieldCheck,
    testId: "maximize-token-card",
    label: "Be part of its security",
    desc: "Take part in securing the blockchain network and its validators.",
  },
];

export default function MarbleOpportunitiesSection() {
  return (
    <SectionContainer
      id="benefits-section"
      customContainerStyle="flex-col gap-12 scroll-mt-40"
    >
      <>
        <div className="flex flex-col text-center gap-3 md:gap-2">
          <CardTitle
            text="Take advantage of Marble"
            testID="marble-opp-title"
            customStyle="w-full"
          />
          <CardDesc
            text="Marble gives you the most exciting opportunities for your DFI."
            testID="marble-opp-desc"
          />
        </div>
        <div className="grid md:grid-cols-4 px-6 md:py-10 md:px-4 divide-y-[0.5px] md:divide-y-0 md:divide-x-[0.5px] divide-dark-00/10 marble-opp-gradient-bg marble-opp-border rounded-[20px]">
          {OpportunitiesItems.map((item, index) => (
            <Item
              key={index}
              Icon={item.icon}
              testID={item.testId}
              label={item.label}
              desc={item.desc}
            />
          ))}
        </div>
      </>
    </SectionContainer>
  );
}

function Item({
  label,
  desc,
  Icon,
  testID,
}: {
  label: string;
  desc: string;
  Icon: IconType;
  testID: string;
}) {
  return (
    <div
      data-testid={`marble-opp-item-${testID}`}
      className="flex-col py-6 md:py-0 md:px-6"
    >
      <div className="mb-[20px]">
        <Icon size={28} />
      </div>
      <div className="flex flex-col gap-2">
        <div className="font-medium text-[20px] leading-[24px]">{label}</div>
        <div className="text-sm leading-[21px]">{desc}</div>
      </div>
    </div>
  );
}
