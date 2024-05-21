import { useContractContext } from "@/context/ContractContext";
import { Interface } from "ethers";
import { useGetTxnCost } from "@/hooks/useGetTxnCost";
import { getDecimalPlace } from "@/lib/textHelper";
import { useGetReadContractConfigs } from "@/hooks/useGetReadContractConfigs";
import { NumericTransactionRow } from "@/app/app/components/NumericTransactionRow";

export default function TransactionRows({
  previewDeposit,
}: {
  previewDeposit: string;
}) {
  const { mDfiToDfiConversion } = useGetReadContractConfigs();
  const { MarbleLsdProxy } = useContractContext();

  const { txnCost } = useGetTxnCost(
    new Interface(MarbleLsdProxy.abi).encodeFunctionData("deposit", [
      MarbleLsdProxy.address,
    ]) as `0x${string}`,
  );

  return (
    <div className="mb-12 md:mb-9 lg:mb-12">
      <NumericTransactionRow
        label="You will receive"
        comment="(after fees)"
        value={{
          value: previewDeposit,
          decimalScale: getDecimalPlace(previewDeposit),
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
