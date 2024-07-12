import { useState } from "react";
import NumericFormat from "@/components/NumericFormat";
import { FiCheckCircle, FiSlash } from "react-icons/fi";
import { TfiWrite } from "react-icons/tfi";
import WriteDialog from "./WriteDialog";
import { DashboardWriteMethodI } from "@/lib/types";

export default function StatsCard({
  value,
  label,
  format,
  decimal = 8,
  suffix,
  writeMethod,
}: {
  value: string | boolean;
  label: string;
  format?: (value: string | string[]) => string;
  decimal?: number;
  suffix?: string;
  writeMethod?: DashboardWriteMethodI;
}) {
  const [openModal, setModalOpen] = useState(false);
  return (
    <div className="panel-ui w-full border border-dark-700/40 rounded-md flex flex-col p-4 mx-auto !backdrop-blur-sm">
      {writeMethod && (
        <>
          <TfiWrite
            className="absolute top-2 right-2"
            onClick={() => setModalOpen(true)}
          />
          <WriteDialog
            isOpen={openModal}
            setIsOpen={setModalOpen}
            writeMethod={writeMethod}
          />
        </>
      )}
      <div className="flex flex-col items-center space-y-4">
        {typeof value === "boolean" ? (
          <span className="font-medium text-dark-300/80 text-wrap	break-all">
            {value ? (
              <FiCheckCircle size={24} className="text-green" />
            ) : (
              <FiSlash size={24} className="text-red" />
            )}
          </span>
        ) : (
          <NumericFormat
            suffix={suffix}
            decimalScale={decimal}
            value={format ? format(value) : value}
            className="font-medium text-dark-300/80 text-wrap	break-all"
          />
        )}
        <span className="font-bold text-xs text-dark-300">{label}</span>
      </div>
    </div>
  );
}
