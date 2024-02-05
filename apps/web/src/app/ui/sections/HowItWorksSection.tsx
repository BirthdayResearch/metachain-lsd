import { Card } from "@/app/ui/components/Card";
import { CardTitle } from "@/app/ui/components/CardTitle";
import { CardDesc } from "@/app/ui/components/CardDesc";
import StakeAmountIcon from "@/app/ui/icons/StakeAmountIcon";
import YieldValueIcon from "@/app/ui/icons/YieldValueIcon";
import MaximizeTokenIcon from "@/app/ui/icons/MaximizeTokenIcon";
import SectionContainer from "../components/SectionContainer";

const HowItWorksItems = [
  {
    icon: StakeAmountIcon,
    testId: "stake-amt-card",
    label: "STAKE AMOUNT",
    desc: "Deposit DFI securely to the protocol within minutes.",
  },
  {
    icon: YieldValueIcon,
    testId: "yield-value-card",
    label: "YIELD VALUE",
    desc: "Receive mDFI and start accruing the value of what you deposited.",
  },
  {
    icon: MaximizeTokenIcon,
    testId: "maximize-token-card",
    label: "MAXIMIZE TOKEN",
    desc: "With the same token, you are free to use it to other EVM applications.",
  },
];

export default function HowItWorksSection() {
  return (
    <SectionContainer customContainerStyle="flex-col gap-12">
      <>
        <div className="flex flex-col text-center gap-2">
          <CardTitle
            text="How it works"
            testID="how-it-works"
            customStyle="w-full"
          />
          <CardDesc
            text="Marble makes it easy for anyone to yield rewards."
            testID="how-it-works-desc"
          />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {HowItWorksItems.map((item) => (
            <Card
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
