import NumericFormat, { NumericFormatProps } from "@/components/NumericFormat";
import { useContractContext } from "@/context/ContractContext";
import { useReadContract } from "wagmi";
import { Interface, formatEther } from "ethers";
import { useGetTxnCost } from "@/hooks/useGetTxnCost";
import { getDecimalPlace, toWei } from "@/lib/textHelper";
import { useGetReadContractConfigs } from "@/hooks/useGetReadContractConfigs";
import Tooltip from "@/app/app/components/Tooltip";
import { FiHelpCircle } from "react-icons/fi";
import React from "react";

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
    <div className="flex flex-col gap-y-1">
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

export function TransactionRow({
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
          <Tooltip content={tooltipText}>
            <FiHelpCircle size={16} />
          </Tooltip>
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
