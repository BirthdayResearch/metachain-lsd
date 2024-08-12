import { useContractContext } from "@/context/ContractContext";
import { Interface, InterfaceAbi, parseEther } from "ethers";
import { useGetTxnCost } from "@/hooks/useGetTxnCost";
import { getDecimalPlace, toWei } from "@/lib/textHelper";
import { useGetReadContractConfigs } from "@/hooks/useGetReadContractConfigs";
import { NumericTransactionRow } from "@/app/app/components/NumericTransactionRow";
import { ActionType } from "@/lib/types";
import BigNumber from "bignumber.js";

export default function TransactionRows({
  inputAmount,
  previewAmount,
  type,
}: {
  inputAmount: string;
  previewAmount: string;
  type: ActionType;
}) {
  const { mDfiToDfiConversion } = useGetReadContractConfigs();
  const { MarbleLsdProxy } = useContractContext();
  const estTxnAmount = new BigNumber(inputAmount).isNaN() ? "1" : inputAmount;

  const txnData =
    type === ActionType.Withdraw
      ? {
          data: new Interface(
            MarbleLsdProxy.abi as InterfaceAbi,
          ).encodeFunctionData("requestRedeem", [
            toWei(estTxnAmount),
            MarbleLsdProxy.address,
          ]) as `0x${string}`,
          value: parseEther("0"),
        }
      : {
          data: new Interface(
            MarbleLsdProxy.abi as InterfaceAbi,
          ).encodeFunctionData("deposit", [
            MarbleLsdProxy.address,
          ]) as `0x${string}`,
          value: parseEther(estTxnAmount),
        };

  const { txnCost } = useGetTxnCost(txnData.data, txnData.value);

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
          decimalScale: new BigNumber(mDfiToDfiConversion).eq(0) ? 2 : 5,
          prefix: `1 mDFI = `,
          trimTrailingZeros: false,
        }}
      />
      <NumericTransactionRow
        label="Max transaction cost"
        value={{
          value: txnCost,
          decimalScale: getDecimalPlace(txnCost),
          prefix: "$",
        }}
      />
    </div>
  );
}
