import { IconType } from "react-icons";
import { Tag } from "@/app/ui/components/Tag";

export function Card({
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
    <div className="flex flex-col gap-6 items-center text-center rounded-[20px] border p-10 card-border card-gradient-background text-light-1000">
      <div>
        <Tag text={label} testID={testID} />
      </div>
      <div>
        <Icon size={32} />
      </div>
      <div className="font-mono text-sm leading-[21px]">{desc}</div>
    </div>
  );
}
