import NumericFormat, {
  NumericFormatProps,
} from "../../../components/NumericFormat";
import { FiHelpCircle } from "react-icons/fi";
import { HoverPopover } from "@/app/app/components/HoverPopover";
import clsx from "clsx";

export function NumericTransactionRow({
  label,
  comment,
  value,
  secondaryValue,
  tooltipText,
  customStyle,
}: {
  label: string;
  comment?: string;
  value: NumericFormatProps;
  secondaryValue?: NumericFormatProps;
  tooltipText?: string;
  customStyle?: string;
}) {
  return (
    <div
      className={clsx(
        "flex flex-row justify-between flex-1 text-wrap",
        customStyle ?? "py-[18px]",
      )}
    >
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
