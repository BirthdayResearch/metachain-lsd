import NumericFormat, { NumericFormatProps } from "@/components/NumericFormat";
import { useContractContext } from "@/context/ContractContext";
import { useReadContract } from "wagmi";
import { Interface, formatEther } from "ethers";
import { useGetTxnCost } from "@/hooks/useGetTxnCost";
import { getDecimalPlace, toWei } from "@/lib/textHelper";
import { useGetReadContractConfigs } from "@/hooks/useGetReadContractConfigs";

export default function TransactionRows({
  stakeAmount,
  isConnected,
}: {
  stakeAmount: string;
  isConnected: boolean;
}) {
  const { mDfiToDfiConversion } = useGetReadContractConfigs();
  const { MarbleLsdProxy } = useContractContext();

  const { txnCost } = useGetTxnCost(
    new Interface(MarbleLsdProxy.abi).encodeFunctionData("deposit", [
      MarbleLsdProxy.address,
    ]) as `0x${string}`,
  );

  const { data: previewDepositData } = useReadContract({
    address: MarbleLsdProxy.address,
    abi: MarbleLsdProxy.abi,
    functionName: "previewDeposit",
    args: [toWei(stakeAmount !== "" ? stakeAmount : "0")],
    query: {
      enabled: isConnected,
    },
  });

  const previewDeposit = formatEther(
    (previewDepositData as number) ?? 0,
  ).toString();

  return (
    <div className="mb-12 md:mb-9 lg:mb-12">
      <TransactionRow
        label="You will receive"
        comment="(after fees)"
        value={{
          value: previewDeposit,
          decimalScale: getDecimalPlace(previewDeposit),
          suffix: ` mDFI`,
        }}
      />
      <TransactionRow
        label="Exchange rate"
        value={{
          value: mDfiToDfiConversion,
          suffix: " DFI",
          decimalScale: getDecimalPlace(mDfiToDfiConversion),
          prefix: `1 mDFI = `,
        }}
      />
      <TransactionRow
        label="Max transaction cost"
        value={{
          value: txnCost,
          suffix: " DFI",
          decimalScale: getDecimalPlace(txnCost),
          prefix: "$",
        }}
      />
    </div>
  );
}

function TransactionRow({
  label,
  comment,
  value,
}: {
  label: string;
  comment?: string;
  value: NumericFormatProps;
}) {
  return (
    <div className="flex flex-row justify-between py-2 flex-1 text-wrap">
      <div>
        <span className="text-xs md:text-sm">{label}</span>
        {comment && (
          <span className="text-xs md:text-sm ml-1 text-dark-00/70">
            {comment}
          </span>
        )}
      </div>
      <NumericFormat className="text-sm font-semibold text-right" {...value} />
    </div>
  );
}
