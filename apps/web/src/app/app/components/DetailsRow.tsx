import clsx from "clsx";
import { FiCopy, FiExternalLink } from "react-icons/fi";
import { useContractContext } from "@/context/ContractContext";

export default function DetailsRow({
  label,
  value,
  hasTxId = false,
  handleOnCopy,
}: {
  label: string;
  value: string;
  hasTxId?: boolean;
  handleOnCopy?: (text: string) => void;
}) {
  const { ExplorerURL } = useContractContext();
  return (
    <div className="flex flex-row justify-between py-[18px] md:items-center">
      <div className="text-sm">{label}</div>
      <div className="flex flex-col md:flex-row items-center gap-y-1 gap-x-2">
        <div
          className={clsx(
            "break-words overflow-hidden font-semibold text-sm text-right w-[141px]",
            {
              "line-clamp-2 md:w-[362px]": !hasTxId,
              "line-clamp-1 md:w-[264px]": hasTxId,
            },
          )}
        >
          {value}
        </div>

        {/*  Copy and external link icon for txId*/}
        {hasTxId && (
          <div className="flex flex-row w-full md:w-fit justify-end">
            <button
              className="hover:bg-light-1000/[0.05] active:bg-light-100/[0.7] rounded-[20px] p-2 cursor-pointer flex flex-row"
              onClick={() => {
                if (handleOnCopy) handleOnCopy(value);
              }}
            >
              <FiCopy size={16} />
            </button>
            <button
              className="hover:bg-light-1000/[0.05] active:bg-light-100/[0.7] rounded-[20px] p-2 cursor-pointer flex flex-row"
              onClick={() => {
                window.open(`${ExplorerURL}/tx/${value}`);
              }}
            >
              <FiExternalLink size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
