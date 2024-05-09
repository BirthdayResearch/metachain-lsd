import ConfirmingPage from "@/app/app/components/ConfirmingPage";
import { FiCopy, FiExternalLink } from "react-icons/fi";
import clsx from "clsx";

export default function StakeConfirmingPage({}: {}) {
  return (
    <ConfirmingPage>
      <>
        <DetailsRow label="You are staking" value="2 DFI" />
        <DetailsRow label="You will receive" value="2 mDFI" />
        <DetailsRow
          label="Receiving Address"
          value="0xe8asdasdasdaasdkl2391923212312593"
        />
        <DetailsRow
          hasTxId
          label="Transaction ID"
          value="0x78d75a997b2d1a074bb2b6a042ae262d675e3a5c8c2a1beeee94701d4bff3af7"
        />
      </>
    </ConfirmingPage>
  );
}

function DetailsRow({
  label,
  value,
  hasTxId = false,
}: {
  label: string;
  value: string;
  hasTxId?: boolean;
}) {
  return (
    <div className="flex flex-row justify-between py-[14px]">
      <div className="text-sm">{label}</div>
      <div className="flex flex-col md:flex-row items-center">
        <div
          className={clsx(
            "break-words ext-ellipsis overflow-hidden font-semibold text-sm text-right",
            {
              "line-clamp-2 w-[141px] md:w-[362px]": !hasTxId,
              "line-clamp-1 w-[141px] md:w-[264px]": hasTxId,
            },
          )}
        >
          {value}
        </div>

        {hasTxId && (
          <div className="flex flex-row w-full md:w-fit justify-end">
            <button
              className="hover:bg-light-1000/[0.05] hover:rounded-[20px] p-2 cursor-pointer flex flex-row"
              onClick={() => {
                navigator.clipboard.writeText(value);
                alert("Copied to clipboard");
              }}
            >
              <FiCopy size={16} />
            </button>
            <button
              className="hover:bg-light-1000/[0.05] hover:rounded-[20px] p-2 cursor-pointer flex flex-row"
              onClick={() => {
                window.open(
                  `https://explorer.defichain.com/#/DFI/mainnet/tx/${value}`,
                );
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
