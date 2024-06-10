import { useContractContext } from "@/context/ContractContext";
import { Interface, InterfaceAbi } from "ethers";
import { useGetTxnCost } from "@/hooks/useGetTxnCost";
import { getDecimalPlace, toWei } from "@/lib/textHelper";
import { useGetReadContractConfigs } from "@/hooks/useGetReadContractConfigs";
import { NumericTransactionRow } from "@/app/app/components/NumericTransactionRow";

export default function TransactionRows({
  previewAmount,
  withdrawAmount,
}: {
  previewAmount: string;
  withdrawAmount?: string;
}) {
  const { mDfiToDfiConversion } = useGetReadContractConfigs();
  const { MarbleLsdProxy } = useContractContext();

  const data = withdrawAmount
    ? (new Interface(MarbleLsdProxy.abi as InterfaceAbi).encodeFunctionData(
        "requestRedeem",
        [toWei(withdrawAmount), MarbleLsdProxy.address],
      ) as `0x${string}`)
    : (new Interface(MarbleLsdProxy.abi as InterfaceAbi).encodeFunctionData(
        "deposit",
        [MarbleLsdProxy.address],
      ) as `0x${string}`);

  const { txnCost } = useGetTxnCost(data);

  return (
    <div>
      <NumericTransactionRow
        label="You will receive"
        comment="(after fees)"
        value={{
          value: previewAmount,
          decimalScale: getDecimalPlace(previewAmount),
          suffix: ` mDFI`,
        }}
      />
      <NumericTransactionRow
        label="Exchange rate"
        value={{
          value: mDfiToDfiConversion,
          suffix: " DFI",
          decimalScale: getDecimalPlace(mDfiToDfiConversion),
          prefix: `1 mDFI = `,
          trimTrailingZeros: false,
        }}
      />
      <NumericTransactionRow
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
