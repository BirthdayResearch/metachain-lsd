import { IconType } from "react-icons";
import { Tag } from "@/components/Tag";

export function Card({
  label,
  desc,
  Icon,
  testId,
}: {
  label: string;
  desc: string;
  Icon: IconType;
  testId: string;
}) {
  return (
    <div className="flex flex-col gap-6 items-center text-center rounded-[20px] border p-10 card-border card-gradient-background">
      <div>
        <Tag text={label} testId={testId} />
      </div>
      <div>
        <Icon size={32} />
      </div>
      <div className="text-sm leading-[21px]">{desc}</div>
    </div>
  );
}
