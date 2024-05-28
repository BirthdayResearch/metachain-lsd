import Tooltip from "@/app/app/components/Tooltip";
import { FiHelpCircle } from "react-icons/fi";
import React from "react";

export default function TransactionRow({
  label,
  value,
  secondaryValue,
  tooltipText,
}: {
  label: string;
  value: string;
  secondaryValue?: string;
  tooltipText?: string;
}) {
  return (
    <div className="flex flex-row justify-between py-2 flex-1 text-wrap">
      <div className="relative flex gap-x-2 items-center">
        <span className="text-xs md:text-sm">{label}</span>
        {tooltipText && (
          <Tooltip content={tooltipText}>
            <FiHelpCircle size={16} />
          </Tooltip>
        )}
      </div>
      <div className="flex gap-x-1">
        <span className="text-sm font-semibold text-right">{value}</span>
        {secondaryValue && (
          <span className="text-sm text-right">{secondaryValue}</span>
        )}
      </div>
    </div>
  );
}
