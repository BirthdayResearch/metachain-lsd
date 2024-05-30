import NumericFormat, {
  NumericFormatProps,
} from "../../../components/NumericFormat";
import { FiHelpCircle } from "react-icons/fi";
import { HoverPopover } from "@/app/app/components/HoverPopover";

export function NumericTransactionRow({
  label,
  comment,
  value,
  secondaryValue,
  tooltipText,
}: {
  label: string;
  comment?: string;
  value: NumericFormatProps;
  secondaryValue?: NumericFormatProps;
  tooltipText?: string;
}) {
  return (
    <div className="flex flex-row justify-between py-2 flex-1 text-wrap">
      <div className="relative flex gap-x-2 items-center">
        <div>
          <span className="text-xs md:text-sm">{label}</span>
          {comment && (
            <span className="text-xs md:text-sm ml-1 text-dark-00/70">
              {comment}
            </span>
          )}
        </div>
        {tooltipText && (
          <HoverPopover popover={tooltipText} placement="top">
            <FiHelpCircle size={16} />
          </HoverPopover>
        )}
      </div>
      <div className="flex gap-x-1">
        <NumericFormat
          className="text-sm font-semibold text-right"
          {...value}
        />
        {secondaryValue && (
          <NumericFormat className="text-sm text-right" {...secondaryValue} />
        )}
      </div>
    </div>
  );
}
