import { IconType } from "react-icons";
import { Label } from "@/app/ui/components/Label";

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
    <div className="flex flex-col gap-6 items-center text-center rounded-[20px] border p-10 card-border card-gradient-background">
      <div>
        <Label text={label} testID={testID} />
      </div>
      <div>
        <Icon size={32} />
      </div>
      <div className="text-sm leading-[21px]">{desc}</div>
    </div>
  );
}
