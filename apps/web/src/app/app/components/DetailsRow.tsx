import clsx from "clsx";
import { FiCopy, FiExternalLink } from "react-icons/fi";
import { useContractContext } from "@/context/ContractContext";
import Link from "next/link";
import StatusBadge from "@/app/app/withdraw/components/StatusBadge";
import { truncateTextFromMiddle } from "@/lib/textHelper";

export enum LinkType {
  TX = "tx",
  STATUS = "status",
  ADDRESS = "address",
}

export default function DetailsRow({
  label,
  value,
  linkType,
  handleOnCopy,
}: {
  label: string;
  linkType?: LinkType;
  value: string;
  handleOnCopy?: (text: string) => void;
}) {
  const { ExplorerURL } = useContractContext();
  return (
    <div className="flex flex-row justify-between py-[18px] md:items-center">
      <div className="text-sm">{label}</div>
      <div className="flex flex-col md:flex-row items-center gap-y-1 gap-x-2">
        <div
          className={clsx(
            "justify-end flex flex-row items-center line-clamp-1 w-[135px] md:w-[228px] lg:w-[350px] gap-x-2",
          )}
        >
          {linkType === LinkType.STATUS && <StatusBadge status={value} />}
          <span className="break-words font-semibold text-sm text-right">
            {linkType && [LinkType.ADDRESS, LinkType.TX].includes(linkType)
              ? truncateTextFromMiddle(value, 12)
              : value}
          </span>
        </div>

        {/* Copy and external link icon */}
        {linkType && [LinkType.TX, LinkType.ADDRESS].includes(linkType) && (
          <div className="flex flex-row w-full md:w-fit justify-end">
            <button
              className="hover:bg-light-1000/[0.05] active:bg-light-100/[0.7] rounded-[20px] p-2 cursor-pointer flex flex-row"
              onClick={() => {
                if (handleOnCopy) handleOnCopy(value);
              }}
            >
              <FiCopy size={16} />
            </button>
            <Link
              className="hover:bg-light-1000/[0.05] active:bg-light-100/[0.7] rounded-[20px] p-2 cursor-pointer flex flex-row"
              href={`${ExplorerURL}/${linkType}/${value}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <FiExternalLink size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
