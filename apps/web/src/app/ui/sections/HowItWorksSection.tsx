import { Card } from "@/app/ui/components/Card";
import { CardTitle } from "@/app/ui/components/CardTitle";
import { CardDesc } from "@/app/ui/components/CardDesc";
import StakeAmountIcon from "@/app/ui/icons/StakeAmountIcon";
import YieldValueIcon from "@/app/ui/icons/YieldValueIcon";
import MaximizeTokenIcon from "@/app/ui/icons/MaximizeTokenIcon";

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
    <div className="w-full flex flex-col items-center justify-center text-light-00 gap-16">
      <div className="">
        <CardTitle text="How it works" testID="how-it-works" customStyle="" />
        <CardDesc
          text="Marble makes it easy for anyone to yield rewards."
          testID="how-it-works-desc"
        />
      </div>
      <div className="flex items-center gap-6">
        {HowItWorksItems.map((item) => (
          <Card
            Icon={item.icon}
            testID={item.testId}
            label={item.label}
            desc={item.desc}
          />
        ))}
      </div>
    </div>
  );
}
